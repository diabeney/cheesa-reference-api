import express from "express";
import { handleRequestReference } from "../../controllers/reference";
import { handleGraduates } from "../../controllers/reference";
import { handleLecturers } from "../../controllers/reference";
const router = express.Router();

router.post("/", handleRequestReference);
//id&accepted
router.post("/lecturer", handleLecturers.handleRespondRequest);
router.get("/lecturer/:id", handleLecturers.handleGetLecturerReferences);
router.get("/graduate/:id", handleGraduates.handleGetGradReferences);

export { router as ReferenceRoutes };
