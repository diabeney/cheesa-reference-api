import { Request, Response } from "express";
import Payments from "../models/paymentModel";
import Users from "../models/userModel";
import { ErrorMsg } from "../utils";
import mongoose from "mongoose";
import Reference from "../models/reference";

type ResponseId = {
	referenceId: string;
};

const PaystackPayments = {
	// Get all Payments by specific user by id
	getPaymentsByUserId: async (req: Request, res: Response) => {
		const { userId } = req.params;

		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		try {
			const payments = await Payments.find({ userId })
				.populate({
					path: "userId",
					select: "firstName, lastName, email",
					model: Users,
				})
				.sort({ createdAt: -1 });

			/*  Checking the length of the payments tank
          to return a reasonable reponse
      */
			if (payments.length <= 0) {
				return res
					.status(404)
					.json(ErrorMsg(404, "There are no payments yet!"));
			}

			return res.status(200).json({ payments });
		} catch (error) {
			console.error(error);
			return res.status(500).json(ErrorMsg(500));
		}
	},
	getComputedData: async (req: Request, res: Response) => {
		try {
			const role = "admin";
			const isAdmin = await Users.findOne({ role });

			// TODO:
			// Return total amount of all payments to the admin
			const allPayments = await Payments.find().sort({ createdAt: -1 });
			const allStudents = await Users.find({
				role: "graduate",
				isVerified: true,
			});
			const allLecturers = await Users.find({
				role: "lecturer",
				isVerified: true,
			});
			const allRequests = await Reference.find();
			const acceptedRequests = await Reference.find({ accepted: "accepted" });
			const declinedRequests = await Reference.find({ accepted: "declined" });
			const notattendedRequests = await Reference.find({ accepted: "null" });

			if (isAdmin?.role === role) {
				if (
					allPayments &&
					allStudents &&
					allLecturers &&
					allRequests &&
					acceptedRequests &&
					declinedRequests &&
					notattendedRequests
				) {
					// Get all the amounts from the payments
					const amounts = allPayments.map((payment) => payment.amount);
					// Sum up all the amounts
					const totalAmount = amounts.reduce((a, b) => a + b, 0);
					const totalStudents = allStudents.length;
					const totalLecturers = allLecturers.length;
					const totalRequests = allRequests.length;
					const totalAcceptedRequests = acceptedRequests.length;
					const totalDeclinedRequests = declinedRequests.length;
					const totalNotAttendedRequests = notattendedRequests.length;

					const data = {
						totalAmount,
						totalStudents,
						totalLecturers,
						totalRequests,
						totalAcceptedRequests,
						totalDeclinedRequests,
						totalNotAttendedRequests,
					};
					return res.status(200).json({ data });
				}
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json(ErrorMsg(500));
		}
	},
	// Get Payment reference id from the payment collection
	getPaymentReferenceId: async (req: Request, res: Response) => {
		const { userId } = req.params;

		// Check if userId is a valid ObjectId
		if (!mongoose.Types.ObjectId.isValid(userId)) {
			return res.status(400).json({ message: "Invalid user ID" });
		}

		try {
			const payment = await Payments.findOne<ResponseId>({ userId });

			if (!payment) return res.status(404).json(ErrorMsg(404));

			return res.status(200).json({ referenceId: payment.referenceId });
		} catch (error) {
			console.error(error);
			return res.status(500).json(ErrorMsg(500));
		}
	},
};

export const { getPaymentsByUserId, getComputedData, getPaymentReferenceId } =
	PaystackPayments;
