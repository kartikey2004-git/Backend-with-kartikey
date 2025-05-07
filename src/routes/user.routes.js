import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

// we can't sent Other type of request like GET type request because /register route post type request handle krenge

router.route("/login").post(loginUser);

// secured routes

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// bss frontend wale ko pata hona chahiye ki kya krne wale iss route pe

// patch mein resource sirf partially update hota hai wrna post mein saari details update hojayengi

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// frontend wale ka role hai ki hum usko kya bol rhe hai and usko usi naam se bhejni padegi and hum or checks bhi laga skte hai

// but ab baat aati getUserChannelProfile tab hum channel ka username params mein se le rhe hai , tab problem aati hai

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);

router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
