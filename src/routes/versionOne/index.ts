import express from "express";
import { AuthRoutes } from "./auth";
import { verifyToken } from "../../middleware";
const router = express.Router();

router.get("/", (_, res) => res.send("Hello"));

router.use("/auth", AuthRoutes);
router.get("/posts", verifyToken, (_, res) => {
  res.status(200).json({ posts: ["one", "two", "three"] });
});

export { router as VERSION_ONE_ROUTER };
