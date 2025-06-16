import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router()

router.route("/register").post(asyncHandler(register))
router.route("/login").post(asyncHandler(login))

export default router