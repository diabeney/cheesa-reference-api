import express from "express";
import {
	handlePayment,
	verifyPayment,
} from "../../controllers/PaystackPayment";
import { getPaymentsByUserId } from "../../db/payment";

const router = express.Router();

router.get("/accept-payment", handlePayment);
router.get("/verify-payment/:reference", verifyPayment);
router.get("/:userId", getPaymentsByUserId);

export { router as PaymentRoutes };
