import express from "express";
import { VERSION_ONE_ROUTER } from "./versionOne";

const router = express.Router();

router.use("/api/v1", VERSION_ONE_ROUTER);

export default router;
