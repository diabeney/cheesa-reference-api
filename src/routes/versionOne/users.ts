import express from "express";
import { handleGetLoggedInUser } from "../../controllers/users";
const router = express.Router();

router.get("/me", handleGetLoggedInUser);

export { router as UserRoutes };
