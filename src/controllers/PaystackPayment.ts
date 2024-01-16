require("dotenv").config();
import https from "https";
import { Request, Response } from "express";
import { getUserByEmail } from "../db/user";
import { AuthRequest } from "../types/types";
import { ErrorMsg } from "../utils";
import { TOTAL_AMOUNT, STATIC_AMOUNT } from "../constants/constants";
import Payments from "../models/paymentModel";
import Reference from "../models/reference";
import Users from "../models/userModel";
import {
	LecturerPaymentConfirmationMessage,
	PaymentVerificationMessage,
} from "../utils/emailTemplate";
import { submitRequestEmail } from "../utils/sendEmail";

const payStack = {
	// Handle Payment Controller (Accept Payment)
	handlePayment: async (req: AuthRequest, res: Response) => {
		const user = req.userPayload;
		try {
			/*  Look for user in the database
          and get the email to use for payment
          after they have been authenticated and
          logged in successfully
      */
			if (user) {
				const { email, id } = user;
				const foundUser = await getUserByEmail(email);

				if (!foundUser) return res.status(404).json(ErrorMsg(400));

				//Get logged in user email if found
				const { email: logged_in_user_email } = foundUser;
				// params from the body

				const params = JSON.stringify({
					email: logged_in_user_email,
					amount: TOTAL_AMOUNT,
					callback_url:
						"https://cheesa-reference-web.vercel.app/app/student/reference/verify-payment",
				});
				// options
				const options = {
					hostname: process.env.PAYSTACK_HOST,
					port: process.env.PAYSTACK_PORT,
					path: "/transaction/initialize",
					method: "POST",
					headers: {
						Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
						"Content-Type": "application/json",
					},
				};

				// client request
				const client_request = https
					.request(options, (api_response) => {
						let data = "";
						api_response.on("data", (chunk) => {
							data += chunk;
						});

						api_response.on("end", async () => {
							try {
								const { status, data: paymentData } = JSON.parse(data);
								if (status === false) {
									return res.status(400).json(ErrorMsg(400));
								}
								// Extract the reference from the payment and save into db
								const { reference } = paymentData;
								console.log(reference);

								return res.status(200).json(data);
							} catch (error) {
								console.log(error);
								return res.status(400).json(ErrorMsg(400));
							}
						});
					})
					.on("error", (error) => {
						console.error(error);
						return res.status(400).json(ErrorMsg(400));
					});
				client_request.write(params);
				client_request.end();
			}
		} catch (error) {
			// Handle any errors that occur during the request
			console.error(error);
			res.status(500).json(ErrorMsg(500));
		}
	},

	// Verify Payment Controller
	verifyPayment: async (req: AuthRequest, res: Response) => {
		const reference = req.params.reference;
		const user = req.userPayload;

		if (!user) return res.status(404).json(ErrorMsg(404));

		const { id } = user;
		try {
			const options = {
				hostname: process.env.PAYSTACK_HOST,
				port: process.env.PAYSTACK_PORT,
				path: `/transaction/verify/${reference}`,
				method: "GET",
				headers: {
					Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
				},
			};

			const api_request = https.request(options, (api_response) => {
				let data = "";

				api_response.on("data", (chunk) => {
					data += chunk;
				});

				api_response.on("end", async () => {
					// Payment confirmation details
					const { status, data: paymentData } = JSON.parse(data);

					// Check if payment was successful
					if (status === false) {
						return res.status(400).json(ErrorMsg(400));
					}
					// Extract the data we need from the payment data
					const {
						id: paymentId,
						domain,
						status: newStatus,
						gateway_response,
						paid_at,
						channel,
						amount,
					} = paymentData;

					if (gateway_response === "Approved") {
						// Save payment to the database
						const newPayment = new Payments({
							userId: id,
							amount: STATIC_AMOUNT,
						});

						await newPayment.save();

						// Find the reference associated with the user and update its transaction status
						await Reference.updateOne(
							{
								graduateId: id,
								accepted: "accepted",
								transactionStatus: "pending",
							},
							{ $set: { transactionStatus: "paid" } },
							{ new: true },
						);
					}

					// Get the email from the payment data
					const {
						customer: { email },
					} = paymentData;

					// Get Lecturer Email associated with a particular reference requested by a graduate
					const reference = await Reference.findOne({
						graduateId: id,
						accepted: "accepted",
						transactionStatus: "paid",
					}).populate({
						path: "lecturerId graduateId",
						select: "firstName lastName email",
						model: Users,
					});

					// Extract lecturer's email
					const lecturerInfo = {
						email: reference?.lecturerId.email,
						name: `${reference?.lecturerId.firstName} ${reference?.lecturerId.lastName}`,
					};

					// Graduate info
					const graduateInfo = {
						email: reference?.graduateId.email,
						name: `${reference?.graduateId.firstName} ${reference?.graduateId.lastName}`,
					};

					const PaymentResponse = {
						paymentId,
						domain,
						newStatus,
						gateway_response,
						paid_at,
						channel,
						amount,
					};

					// Send Email
					const verificationInfo = PaymentVerificationMessage(
						PaymentResponse,
						graduateInfo,
					);
					const dispatchedMessage = submitRequestEmail({
						to: email,
						subject: "Payment Verification from RefHub",
						message: verificationInfo,
					});

					// Send Email to the lecturer
					const paymentConfirmation = LecturerPaymentConfirmationMessage(
						PaymentResponse,
						lecturerInfo,
					);
					const dispatchedMessageToLecturer = submitRequestEmail({
						to: lecturerInfo.email,
						subject: "Payment Notification from RefHub",
						message: paymentConfirmation,
					});

					if (!dispatchedMessage) return res.status(500).json(ErrorMsg(500));
					await dispatchedMessage;

					if (!dispatchedMessageToLecturer)
						return res.status(500).json(ErrorMsg(500));
					await dispatchedMessageToLecturer;

					return res.status(200).json(data);
				});
			});

			api_request.on("error", (error) => {
				console.error(error);
				res.status(500).json(ErrorMsg(500));
			});

			// End the request object if there is no error
			api_request.end();
		} catch (error) {
			console.error(error);
			res.status(500).json(ErrorMsg(500));
		}
	},
};

export const { handlePayment, verifyPayment } = payStack;
