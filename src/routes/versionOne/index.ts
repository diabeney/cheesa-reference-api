import express from "express";
import { AuthRoutes } from "./auth";
import { isAdmin, verifyToken } from "../../middleware";
import { UserRoutes } from "./users";
import { ReferenceRoutes } from "./reference";
import { PaymentRoutes } from "./payment";
import { getComputedData } from "../../db/payment";
import { SummaryRoutes } from "./summary";

const router = express.Router();

router.get("/", (_, res) => res.send("Hello"));

router.use("/auth", AuthRoutes);
router.use("/users", verifyToken, UserRoutes);
router.use("/reference", verifyToken, ReferenceRoutes);
router.use("/payments", verifyToken, PaymentRoutes);
router.use("/summary", verifyToken, SummaryRoutes);

// the /posts route is for testing purposes
router.get("/posts", verifyToken, (_, res) => {
	res.status(200).json({ posts: ["one", "two", "three"] });
});

export { router as VERSION_ONE_ROUTER };
