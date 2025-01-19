import express from "express";
import { handleRequestReference } from "../../controllers/reference";
import { handleGraduates } from "../../controllers/reference";
import { handleViewReference, handleUpdateReference } from "../../controllers/reference";
import { handleLecturers } from "../../controllers/reference";
import { isAdmin } from "../../middleware";

const router = express.Router();

router.post("/", handleRequestReference);
router.get("/:id", handleViewReference);
// endpoint for lecturers to accept or decline references requests
router.post("/lecturer", handleLecturers.handleRespondRequest);
router.get("/lecturer/:id", handleLecturers.handleGetLecturerReferences);
router.get("/graduate/:id", handleGraduates.handleGetGradReferences);
router.post("/submitted", handleLecturers.handleSubmitRequest);

// endpoint for admins to updatePayment field
router.patch("/trans/:id", isAdmin, handleUpdateReference);
export { router as ReferenceRoutes };
