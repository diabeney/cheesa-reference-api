import express from "express";
import { handleGetLoggedInUser } from "../../controllers/users";
import { handleGetUsers } from "../../controllers/users";
import { handleUpdateUser } from "../../db/user";

const router = express.Router();
//user
router.get("", handleGetUsers); // GET users with search parameters
router.get("/me", handleGetLoggedInUser);
router.patch("/update/:userId", handleUpdateUser);

export { router as UserRoutes };
