import express from "express";
import { isAdmin } from "../../middleware";
import { getComputedData } from "../../db/payment";

const router = express.Router();

router.get("/", isAdmin, getComputedData); //Only admins have access to this!

export { router as SummaryRoutes };
