import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

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

  const incomingRefreshtoken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshtoken) {
    throw new ApiError(401, "unauthorized request");
  }

  // decoded token mil jayega , wrna user ke pass jo token gaya and jo database mein save hai wo alag alag hai kyuki user ke pass encrypted token jaata hai

  // It is not necessary that the decoded token contains a payload (data), it may or may not

  try {
    const decodedToken  = jwt.verify(
      incomingRefreshtoken,
      process.env.REFRESH_TOKEN_SECRET
    );
  
    const user = await User.findById(decodedToken?._id)
    
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
  
    // Now we have received tokens in two ways, one is our incoming refresh token or decoded token and the refresh token which was generated and encoded, we saved it in user's mongoDB (database)
  
    if (incomingRefreshtoken != user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }
  
    // agar dono refresh tokens match kr jaate hai toh hum naye access and refresh token generate krayenge  
  
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
  
    
    const options = {
      httpOnly: true,
      secure: true,
    }
  
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
    )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
})



export { registerUser, loginUser, logoutUser , refreshAccessToken };
