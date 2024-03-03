import { Schema, model } from "mongoose";

export interface LecturerEmails {
	email: string;
}

const LecturerEmailsSchema = new Schema({
	email: { type: String, required: true },
});

const LecturerEmails = model<LecturerEmails>(
	"LecturerEmails",
	LecturerEmailsSchema,
);
export default LecturerEmails;
