import cron from "node-cron";
import Reference from "../models/reference";
import { submitRequestEmail } from "../utils/sendEmail";
import Users from "../models/userModel";
import { requestReminderMessage } from "../utils/emailTemplate";
import { ReferenceResponse } from "../types/types";

const sendLecturerReminder = async () => {
	const reminderDaysFromExpectedDate = new Date();
	reminderDaysFromExpectedDate.setDate(
		reminderDaysFromExpectedDate.getDate() - 1,
	); // 1 day before the expected

	try {
		// Find references that have an expectedDate 1 day from it and whose status is not 'submitted'
		const references = await Reference.find<ReferenceResponse>({
			accepted: "accepted",
			transactionStatus: "paid",
			//Expected date is between 1 day from now
			expectedDate: { $gte: reminderDaysFromExpectedDate },
			status: { $ne: "submitted" },
		}).populate({
			path: "lecturerId graduateId",
			select: "firstName lastName email destination, status",
			model: Users,
		});

		for (const reference of references) {
			//  Send email to lecturer
			const lectuerInfo = {
				name: `${reference.lecturerId.firstName} ${reference.lecturerId.lastName}`,
				email: reference.lecturerId.email,
			};

			const referenceDetails = {
				name: `${reference.graduateId.firstName} ${reference.graduateId.lastName}`,
				destination: reference.destination,
				status: reference.status,
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

			if (!dispatchedMessages) {
				throw new Error("Error sending email");
			}

			console.log("Reminder Email sent to lecturer");
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
	}
};

export const startCron = (() => {
	cron.schedule("50 6 * * *", sendLecturerReminder);
})();
