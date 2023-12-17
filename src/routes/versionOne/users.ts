import express from "express";
import { handleGetLoggedInUser } from "../../controllers/users";
import { handleGetUsers } from "../../controllers/users";
const router = express.Router();
//user
router.get("", handleGetUsers); // GET users with search parameters
router.get("/me", handleGetLoggedInUser);

export { router as UserRoutes };
