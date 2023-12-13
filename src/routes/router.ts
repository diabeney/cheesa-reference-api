import express from "express";
import { v1 } from "./versionone";
const router = express.Router();

router.use("/api/v1", v1);

export default router;
