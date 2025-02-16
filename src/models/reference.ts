import mongoose, { Types } from "mongoose";

const ReferenceSchema = new mongoose.Schema({
	graduateId: {
		type: Types.ObjectId,
		ref: "User",
		required: true,
	},
	lecturerId: {
		type: Types.ObjectId,
		ref: "User",
		required: true,
	},
	refPaymentId: {
		type: Types.ObjectId,
		ref: "Payments",
	},
	purposeOfReference: {
		type: String,
		default: "scholarship",
		enum: ["postgraduate-study", "scholarship", "job"],
	},
	modeOfPostage: {
		type: String,
		default: "online",
		enum: ["online", "hard-copy", "scanned-letter"],
	},
	destination: {
		type: String,
		required: true,
	},
	address: String,
	expectedDate: {
		type: String,
		required: true,
	},
	accepted: {
		type: String,
		default: "null",
		enum: ["accepted", "declined", "null"],
	},
	status: {
		type: String,
		default: "not ready",
		enum: ["not ready", "submitted"],
	},
	transactionStatus: {
		type: String,
		default: "pending",
		enum: ["pending", "paid"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Reference = mongoose.model("Reference", ReferenceSchema);

export default Reference;
