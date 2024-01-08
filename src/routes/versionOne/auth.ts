import express from "express";
import {
	handleLogin,
	handleRefreshToken,
	handleSignUp,
} from "../../controllers/auth";
import { resetPassword } from "../../controllers/resetPassword";
import { forgotPassword } from "../../controllers/forgotPassword";
import { verifyEmailToken } from "../../controllers/verifyEmailToken";

const router = express.Router();

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.post("/refresh", handleRefreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify-email/:token", verifyEmailToken);

export { router as AuthRoutes };
