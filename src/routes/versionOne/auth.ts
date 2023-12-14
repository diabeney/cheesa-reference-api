import express from "express";
import { SignUp, login } from "../../controllers/auth";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", login);

export { router as AuthRoutes };
