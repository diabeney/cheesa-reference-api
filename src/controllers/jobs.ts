// import cron from "node-cron";
import Reference from "../models/reference";
import { submitRequestEmail } from "../utils/sendEmail";
import Users from "../models/userModel";
import { requestReminderMessage } from "../utils/emailTemplate";
import { ReferenceResponse } from "../types/types";

export const startCron = () => {
	const sendLecturerReminder = async () => {
		// Get the current date
		const currentDate = new Date();
		const tomorrow = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

		try {
			const references = await Reference.find<ReferenceResponse>({
				accepted: "accepted",
				transactionStatus: "paid",
				status: "not ready",
				expectedDate: { $lte: tomorrow },
			}).populate({
				path: "lecturerId graduateId",
				select:
					"firstName lastName email destination, status purposeOfReference programme",
				model: Users,
			});

			for (const reference of references) {
				console.log(reference);
				//  Send email to lecturer
				const lectuerInfo = {
					name: `${reference.lecturerId.firstName} ${reference.lecturerId.lastName}`,
					email: reference.lecturerId.email,
				};

				const referenceDetails = {
					name: `${reference.graduateId.firstName} ${reference.graduateId.lastName}`,
					destination: reference.destination,
					status: reference.status,
					purposeOfReference: reference.purposeOfReference,
					programme: reference.graduateId.programme,
					dueDate: reference.expectedDate,
					id: reference._id,
				};
				const templateHandler = requestReminderMessage(
					referenceDetails,
					lectuerInfo,
				);

				const dispatchedMessages = submitRequestEmail({
					to: lectuerInfo.email,
					subject: "Reference Request Reminder",
					message: templateHandler,
				});

				await dispatchedMessages;
				console.log(
					"\x1b[32m✓ \x1b[35m%s\x1b[0m",
					`[Evans] Reminder Email sent to ${lectuerInfo.email}`,
				);
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
			}
		}
	};
	const interval = 60 * 1000;

	// Check for reminder every minute
	setInterval(() => {
		const now = new Date();
		const currentHour = now.getHours();
		const currentMinute = now.getMinutes();

		// Call the Reminder Function
		if (currentHour === 8 && currentMinute === 0) {
			sendLecturerReminder();
		}
		console.log(
			"\x1b[32m✓ \x1b[35m%s\x1b[0m",
			"[Evans] Searching for a job...",
		);
	}, interval);
};
