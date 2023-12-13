import express from "express";
import { graduateSignup, lecturerSignup } from "../controllers/auth";

const router = express.Router();

router.get("/", (_, res) => res.send("Hello"));
router.post("/graduate/signup", graduateSignup);

router.post("/lecturer/signup", lecturerSignup);

export { router as VERSION_ONE_ROUTER };
