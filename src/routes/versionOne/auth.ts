import express from "express";
import {
  handleLogin,
  handleRefreshToken,
  handleSignUp,
} from "../../controllers/auth";

const router = express.Router();

router.post("/signup", handleSignUp);
router.post("/login", handleLogin);
router.post("/refresh", handleRefreshToken);

export { router as AuthRoutes };
