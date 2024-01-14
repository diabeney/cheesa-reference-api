import { submitRequestEmail } from "../utils/sendEmail";
import { forgotPasswordMessage } from "../utils/emailTemplate";
import { Request, Response } from "express";
import { getUserByEmail } from "../db/user";
import { ErrorMsg } from "../utils";

const forgotPassword = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		if (!email) return res.status(400).json(ErrorMsg(400));

		const foundUser = await getUserByEmail(email);

		if (!foundUser) return res.status(404).json(ErrorMsg(404));

		const resetToken = foundUser.getResetPasswordToken();

		await foundUser.save();

		const resetUrl = `${process.env.CLIENT_URL_LIVE}/reset-password/?token=${resetToken}`;
		const message = forgotPasswordMessage(resetUrl, foundUser);

		const dispatchedMessage = submitRequestEmail({
			to: foundUser.email,
			subject: "Password Reset Request",
			message,
		});

		if (!dispatchedMessage) return res.status(500).json(ErrorMsg(500));

		await dispatchedMessage;

		res.status(200).json({
			message: `Reset link sent successfully to ${foundUser.email} with further instructions`,
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		}
	}
};

export { forgotPassword };
