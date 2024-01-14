import express from "express";
import { handleRequestReference } from "../../controllers/reference";
import { handleGraduates } from "../../controllers/reference";
import { handleViewReference } from "../../controllers/reference";
import { handleLecturers } from "../../controllers/reference";
const router = express.Router();

router.post("/", handleRequestReference);
router.get("/:id", handleViewReference);
// endpoint for lecturers to accept or decline references requests
router.post("/lecturer", handleLecturers.handleRespondRequest);
router.get("/lecturer/:id", handleLecturers.handleGetLecturerReferences);
router.get("/graduate/:id", handleGraduates.handleGetGradReferences);
router.post("/submitted", handleLecturers.handleSubmitRequest);
export { router as ReferenceRoutes };
