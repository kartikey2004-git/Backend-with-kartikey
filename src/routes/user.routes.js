import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js"

const router = Router();

router.route("/register").post(registerUser);

// we can't sent Other type of request like GET type request because /register route post type request handle krenge 


export default router;
