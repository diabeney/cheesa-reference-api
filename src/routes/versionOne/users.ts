import express from "express";
import {
	addLecturerEmails,
	handleAdminUpdateUser,
	handleDeleteUser,
	handleGetLoggedInUser,
	handleGetUsers,
} from "../../controllers/users";
import { handleUpdateLecturer, handleUpdateUser } from "../../db/user";
import { isAdmin } from "../../middleware";

const router = express.Router();
//user
router.get("", handleGetUsers); // GET users with search parameters
router.get("/me", handleGetLoggedInUser);
router.post("/emails", isAdmin, addLecturerEmails);
router.patch("/update/:userId", handleUpdateUser);
router.patch("/:lecturerId", handleUpdateLecturer); // Only lecturers can update their availability
router.patch("/admin/:userId", isAdmin, handleAdminUpdateUser); // Only admins can update user's bluesheet

router.delete("/admin/:userId", isAdmin, handleDeleteUser); // Only admins can delete user

export { router as UserRoutes };
