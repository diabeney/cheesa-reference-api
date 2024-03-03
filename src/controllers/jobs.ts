import moment from "moment-timezone";
import Reference from "../models/reference";
import { submitRequestEmail } from "../utils/sendEmail";
import Users from "../models/userModel";
import { requestReminderMessage } from "../utils/emailTemplate";
import { ReferenceResponse } from "../types/types";
import { differenceInCalendarDays } from "date-fns";
export const startCron = () => {
	const sendLecturerReminder = async () => {
		try {
			const references = await Reference.find<ReferenceResponse>({
				accepted: "accepted",
				transactionStatus: "paid",
				status: "not ready",
			}).populate({
				path: "lecturerId graduateId",
				select:
					"firstName lastName email destination, status purposeOfReference programme",
				model: Users,
			});

			for (const reference of references) {
				// Parse the expectedDate to a Date object
				const expectedDate = differenceInCalendarDays(
					new Date(reference.expectedDate),
					new Date(),
				);

				// Check if the expectedDate is tomorrow
				if (expectedDate === 1) {
					// Send email to lecturer
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
						`[REFHUB] Reminder Email sent to ${lectuerInfo.email}`,
					);
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error(error.message);
				console.error(error.stack);
			}
		}
	};

	const interval = 60 * 1000;

	// Check for reminder every hour
	setInterval(() => {
		const now = moment().tz("Etc/GMT");
		const currentHour = now.hour();
		const currentMinute = now.minute();

		// Call the Reminder Function
		if (currentHour === 21 && currentMinute === 0) {
			sendLecturerReminder();
		}
		console.log(
			"\x1b[32m✓ \x1b[35m%s\x1b[0m",
			"[REFHUB] Searching for a job...",
		);
	}, interval);
};
