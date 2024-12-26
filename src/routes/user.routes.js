import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(registerUser)

// error
// Route.post() requires a callback function but got a [object Undefined]

export default router

