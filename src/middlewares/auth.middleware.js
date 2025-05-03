import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // cookie-parser lagane se cookie access kr pa rhe hai , cookies two way access hoti hai both ( req,res) because humne middleware add kiya h

    // for mobile devices ho skta hai user ek custom header bhej rha ho

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      // TO-Do --> discuss about frontend
      throw new ApiError(401, "Invalid Access token");
    }

    req.user = user;

    // Ab jab bhi koi route pe call aayega ➔ req.user ke through user ka data hamesha ready hoga.

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
