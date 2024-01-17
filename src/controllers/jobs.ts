import cron from "node-cron";
import Reference from "../models/reference";
import { submitRequestEmail } from "../utils/sendEmail";
import Users from "../models/userModel";
import { requestReminderMessage } from "../utils/emailTemplate";
import { ReferenceResponse } from "../types/types";

const sendLecturerReminder = async () => {
	const reminderDaysFromNow = new Date();
	reminderDaysFromNow.setDate(reminderDaysFromNow.getDate() + 10); // 10 days from now

	try {
		// Find references that have an expectedDate that is between now and 10 days from now and whose status is not 'submitted'
		const references = await Reference.find<ReferenceResponse>({
			accepted: "accepted",
			transactionStatus: "paid",
			//Expected date is between 10 days from now
			expectedDate: { $lte: reminderDaysFromNow, $gt: new Date() },
			status: { $ne: "submitted" },
		}).populate({
			path: "lecturerId graduateId",
			select: "firstName lastName email destination, status",
			model: Users,
		});

		for (const reference of references) {
			//  Send email to lecturer
			const lectuerInfo = {
				name: `${reference.lecturerId.firstName}`,
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

			console.log("Reminder Email sent to lecturer at 6:45am");
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
	}
};

export const startCron = (() => {
	cron.schedule("45 6 * * *", sendLecturerReminder);
})();
