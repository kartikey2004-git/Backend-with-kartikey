import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  // Get user details from frontend ( extract all data points )

  const { username, email, fullName, password } = req.body;

  // console.log(req.body)

  console.table([
    { Field: "Username", Value: username },
    { Field: "Email", Value: email },
    { Field: "Full Name", Value: fullName },
  ]);

  // Validation - fields should not be empty

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Validate email format

  if (!email.includes("@")) {
    throw new ApiError(400, "Invalid email address");
  }

  // Check if user already exists (by username or email)

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // console.log(existedUser)

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  //  console.log(req.files);

  // check for coverimages,check for avatar

  // multiple option de rhe the user ko file upload krane ka kyuki routes mein array le rhe the avatar and coverImage

  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  // let coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // upload them to cloudinary , avatar and humein yaha se response mein URL mil jayega

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // create user object - create entry in db

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    avatar_public_id: avatar.public_id,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // check for user creation and by select method se do field ke alawa saare field ayenge but ye do field nhi ayenge kyuki humne field se pehle - laga diya hai

  // remove password and refresh token field from response

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // return response

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered sucessfully"));
});

// We are not handling any web requests here. so NO need to asyncHandler

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    // generate here access and refresh token by custom methods which are defined in user schema

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // insert refresh token into database

    user.refreshToken = refreshToken;

    // user.save() is a Mongoose method that saves the current document (user) to the MongoDB database.

    // The option { validateBeforeSave: false } disables Mongoose validation before saving.

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  // First of all to login we will need user details from postman and frontend ( req.body ) extract all data points

  const { email, password, username } = req.body;
  console.log(email);

  // Then we will check if the username or email is present or not

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  // Then we will find the user in the database by username and email

  // findOne returns the first entry of a document on basis of either username or email

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exists");
  }

  // Then we will check whether the password given by the user matches the password of the database or not

  // User mongoose ka object hai ( toh wo access kr skta hai jo mongoose ke through methods available hai like findOne )

  // Jab aap database se kisi user instance ko fetch karteto , us instance pe aapke custom methods bhi available hote hain, agar wo methods model/schema ke andar define kiye gaye hain.

  const isPasswordValid = user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Then we will generate access and refresh token
  // DB operation time lg skta hai ( async nature of javascript )

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // send it to the user in cookies

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)

    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loggedIn successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // Logout ka matlab hai

  //  Client side ko bhi tokens hataane ko bolo ( refresh token jo hai user model mein wo bhi clear hona chahiye and  reset krna padega )

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  // Session tokens ( cookies se ) invalidate karo (cookies + DB se refreshToken hatao)

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  // ab humein sochna hai AccessToken ko refresh kaise krwa payenge

  // refresh token bhejna padega ( cookies se access kr skte hai )

  const incomingRefreshtoken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshtoken) {
    throw new ApiError(401, "unauthorized request");
  }

  // decoded token mil jayega , wrna user ke pass jo token gaya and jo database mein save hai wo alag alag hai kyuki user ke pass encrypted token jaata hai

  // It is not necessary that the decoded token contains a payload (data), it may or may not

  try {
    const decodedToken = jwt.verify(
      incomingRefreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // Now we have received tokens in two ways, one is our incoming refresh token or decoded token and the refresh token which was generated and encoded, we saved it in user's mongoDB (database)

    if (incomingRefreshtoken != user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    // agar dono refresh tokens match kr jaate hai toh hum naye access and refresh token generate krayenge

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  // simply se user se current password change krwana hai

  const { oldPassword, newPassword } = req.body;

  // After verifyJWT req.user me authenticated user ka data aa chuka hai

  // Us user.id ke basis pe hum database me user ko access kar ke password update kar sakte hain

  const user = await User.findById(req.user?._id);

  // mongoDb ka user model hai iske pass custom methods ka access hota hai

  const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isOldPasswordCorrect) {
    throw new ApiError(400, "Invalid old Password");
  }

  // set new password now

  user.password = newPassword;

  // save the user with new password

  user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed Sucessfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  // humhara auth middleware JWT ya session ko verify karta ha

  // and Uske baad humne current user ( loggedIn user ) information ko req.user me store kar diya hai (jaise id, email, role, etc.)

  return res
    .status(200)
    .json(200, req.user, "Current user fetched sucessfully");
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName?.trim() || !email?.trim()) {
    throw new ApiError(400, "All fields are required");
  }

  // trim() lagane se agar koi user spaces dal ke bheje (e.g., " "), wo bhi invalid mana jayega.

  // sabse pehle current user find krna padega

  // new : true krne se update hone ke baad jo information hai woh humein return hoti hai

  // set recieve krta hai ek object , uss object mein hum parameter dete hai

  // select :: Specifies which document fields to include or exclude (also known as the query "projection")

  // Another Approach :: hum yaha pe ek extra db call bacha liye jisme user._id se call krte DB ko and phir usme se password hata dete toh ek DB call bach gyi

  const updatedUser = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Account details updated sucessfully")
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  // jab humne avatar ko change krdiya hai , matlab humne new avatar image ko cloudinary pe upload krke url leke DB calls se user mein new avatar set krna hai

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user?.avatar_public_id) {
    await deleteFromCloudinary(user.avatar_public_id);
  }

  const updatedAvatar = await uploadOnCloudinary(avatarLocalPath);

  if (!updatedAvatar.url) {
    throw new ApiError(400, "Error while uploading avatar on cloudinary");
  }

  // Patch hi toh route krenge yaha kyuki saari ki saari value thodi update krni hai

  // Another Approach ab humein update krna hai takhi field avatar jyada field update nhi krne hai , jyada kuch thodi hai object ke andar value hi toh update ho rhi hai and updated profile dikhni chahiye user ko

  /* 

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: updatedAvatar.url,
        avatar_public_id: updatedAvatar.public_id,
      },
    },
    { new: true }
  ).select("-password")

  */

  //  Update user with new avatar URL & public_id

  user.avatar = updatedAvatar.url;
  user.avatar_public_id = updatedAvatar.public_id;

  await user.save();

  // Remove password before sending response

  const userObject = user.toObject();
  // Mongoose Document ko normal JS Object me convert

  delete userObject.password;
  // Password field hata diya

  return res
    .status(200)
    .json(new ApiResponse(200, userObject, "Avatar updated Sucessfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  // sabse pehle humein multer middleware se req.files and ab humara cloudinary wagerah use krne ka mann nhi hai , toh hum isi situation mein database mein ise save kra skte hai

  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage file is missing");
  }

  const updatedCoverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!updatedCoverImage.url) {
    throw new ApiError(400, "Error while uploading Cover Image on cloudinary");
  }

  // ab humein update krna hai ekhi field avatar jyada field update nhi krne hai , jyada kuch thodi hai object ke andar value hi toh update ho rhi hai and updated profile dikhni chahiye user ko

  // patch hi toh route krenge yaha kyuki saari ki saari value thodi update krni hai

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: updatedCoverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image updated Sucessfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  // check krenge username exists krta bhi ya nhi , ho skta hai params empty ho , kuch username hona chahiye uske basis pe query krenge na

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  // ab main ye soch rha hu ki sabse pehle toh user find krlenge iss username ka DB query krke document find krlete hai and phir id ke basis pe aggregation lagayenge

  // hum direct hi aggregation pipeline laga skte hai , kyuki waha pr match field hota hai toh wo automatially saare documents mein sirf ek document find krlega

  // Array ke andar further objects/pipelines/stages likhi jaati hai

  // An array of aggregation pipelines to execute

  // Database lekin another continent mein hota hai toh time lagega

  // jo value return mein aati hai aggregation pipeline likhne ke baad wo arrays aate hai ,  aage we further discuss iske baare mein

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
      // ab humare pass ek document hai iss ke basis pe lookup krna hai

      // ab humein chai code ke subscribers kitne hai woh find krna hai
    },

    {
      $lookup: {
        from: "subscription",
        localField: "_id",
        foreignField: "channel",

        // isse kya jo given username hai chai aur code uske mein woh saare subscriptions document aajayenge jinme channel chai aur code hoga ( subscribers mil jayenge )

        // count bhi krenge inhe abhi

        as: "subscribers",
      },

      // iss pipeline mein humne saare documents ko ek jagah krke rkh liya hai
    },

    // ab chai aur code ne kitne channels ko subscribe kr rkha hai wo bhi toh nikalna hai

    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",

        // saare subscriptions document mein jinme subscriber ki field mein jo given username h agar wo chai aur code likha hoga  woh saare aajayenge

        as: "subscribedTo",
      },

      // ab humare pass dono fields aa chuke hai , dono alag alag hai , ab dono  fields ko add krdenge with existing information ke sath
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },

        // hum kya krenge frontend wale ko true ya false message bhej denge or uske basis wo calculate krlega ki user subscribed hai ya nhi hai jis channel pr wo gya hai

        isSubscribed: {
          // humein ye dekhna hai basically , ki humare pass jo documents aaya hai subscribers usme current user hai ya nhi

          $condition: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,

            // check krega req.user(current user ya loggedIn user ki _id ,  subscribers field mein subscriber object mein hai ya nhi )

            // in :: arrays and objects dono mein dekh leta hai
          },
        },
      },
    },
    {
      // project :: humein projection deta hai ki main saari values ko project nhi krunga waha pe jo bhi usko demand kr rha hai , main selected  cheezein dunga

      $project: {
        fullName: 1, // as flag
        username: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  console.log(channel);

  // kayi baar aise cheezein bhi aayengi ki value humein pata nhi hogi ki kya aa rhi hai .. what does datatype aggregate returns

  // output humein array milta hai jiske andar humari values hai , lekin humare pass toh match se sirf ek hi user mila hai but ho skta hai multiple values bhi mil skti hai

  // jitni bhi aggregation pipelines hai wo mostly array hi return krti hai

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exist");
  }

  // we can return array also but difficulties in frontend phir

  return res
    .status(200)
    .json(new ApiResponse(200, channel[0], "User channel fetched sucessfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
};
