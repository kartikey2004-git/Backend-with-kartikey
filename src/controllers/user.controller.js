import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAccessAndRefreshTokens = async(userId) => {
  try {
    const user =  await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken}

  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating refresh and access token")
  }
}

const registerUser = asyncHandler(async(req,res) => {

  // get user details from frontend
  const {fullName,username,email,password} = req.body
  // console.log(req.body)
  console.log("email",email);

  // validation - not empty
  if(
    [fullName,email,username,password].some((field) => field?.trim() === "")
  ){
    throw new ApiError(400,"All fields are required")
  }

  // check if user already exists: username,email
  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if(existedUser){
    throw new ApiError(409,"User with email or username already exist")
  }

  // console.log(req.files);

  // check for coverimages,check for avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path; 
  
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  let coverImageLocalPath;
  if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
  }
  

  if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file is required")
  }

  // upload them to cloudinary , avatar
  
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  
  if(!avatar){
    throw new ApiError(400,"Avatar file is required")
  }
  
  // create user object - create entry in db

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  })

  // check for user creation 
  // remove password and refresh token field from response 

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
  }
  
  
  // return response
  return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered sucessfully")
  )
})

const loginUser = asyncHandler(async(req,res) => {
 
  // req-body -> data 
  const {email,password,username} = req.body
  
  // username or email based access
  if (!username || !email) {
    throw new ApiError(400,"username or email is required")
  }
  
  // find the user 
  const user = await User.findOne({
    $or: [{username},{email}]
  })

  if (!user) {
    throw new ApiError(404,"User does not exists")
  }

  // password check
  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401,"Invaid user credentials")
  }
  
  // access and refresh token
  const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)

  
  // HTTP cookies (also called web cookies, Internet cookies, browser cookies, or simply cookies) are small blocks of data created by a web server while a user is browsing a website and placed on the user's computer or other device by the user's web browser. Cookies are placed on the device used to access a website, and more than one cookie may be placed on a user's device during a session.

  //  sends in cookies
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse (
      200,
      {
        user:loggedInUser,accessToken,refreshToken
      },
      "User loggedIn successfully"
    )
  )

})

const logoutUser = asyncHandler(async(req,res) => {
  // clear the cookies bcoz only manage from user
  // reset the refresh token
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken: undefined
      }
    },
    {
      new:true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200,{},"User logged out successfully"))
  
})

export {registerUser,loginUser,logoutUser}

