import { Request, Response } from "express";
import Verification from "../models/verificationModel";
import Users from "../models/userModel";
import { ErrorMsg } from "../utils";
import { adminNotification } from "../utils/emailTemplate";
import { submitRequestEmail } from "../utils/sendEmail";

const verifyEmailToken = async (req: Request, res: Response) => {
	try {
		const { token } = req.params;

		// Find verification token
		const verificationToken = await Verification.findOne({ token });

		if (!verificationToken) {
			return res.status(400).json(ErrorMsg(500, "Invalid verification token"));
		}

		// Find user associated with the token
		const user = await Users.findById(verificationToken.userId);

		// Check if user exists
		if (!user) {
			return res.status(400).json(ErrorMsg(400, "User not found"));
		}

		// Check if user is already verified
		if (user.isVerified) {
			return res.status(400).json(ErrorMsg(400, "User already verified"));
		}

		// Verify and save the user
		user.isVerified = true;
		await user.save();

		if (user.role === "graduate") {
			// Get all Admin Email & notify admin when a graduate signs up
			const admin_email = await Users.find({ role: "admin" });

			// get each email and send payloads
			for (const emails of admin_email) {
				const graduateRecords = {
					name: `${user.firstName} ${user.lastName}`,
					email: user.email,
					programme: user.programme,
				};
				const adminMessage = adminNotification(graduateRecords);
				const adminEmail = submitRequestEmail({
					to: emails.email,
					subject: "New User Notification",
					message: adminMessage,
				});

				if (!adminEmail) return res.status(500).json(ErrorMsg(500));

				await adminEmail;
			}
		}

		res.status(200).json({
			message: "Account verified successfully",
		});

		// Delete verification token after successful verification
		await Verification.deleteOne({ token });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json(ErrorMsg(500, error.message));
		}
	}
};

export { verifyEmailToken };
