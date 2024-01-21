import { z } from "zod";
import { Types } from "mongoose";

const SignUpShape = z.object({
	firstName: z.string({ required_error: "First Name is required" }),
	lastName: z.string({ required_error: "Last Name is required" }),
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" }),
	role: z.enum(["lecturer", "graduate"]),
	referenceNumber: z
		.string({ required_error: "Reference Number is required" })
		.min(8, "Reference should be at least 8 characters"),
	indexNumber: z
		.string()
		.min(7, "Index number should be at least 8 characters")
		.optional(),
	entryYear: z.string().optional(),
	graduationYear: z.string().optional(),
	programme: z.enum(["chemical", "petrochemical"]).optional(),
	nss: z.string().optional(),
	placeOfWork: z.string().optional(),
	telephone: z.string().optional(),
});

const LoginShape = SignUpShape.pick({ email: true, password: true });

// Define the scheme for a single request
const requestSchema = z.object({
	destination: z.string({
		required_error: "Destination is required",
	}),
	expectedDate: z.string({
		required_error: "Expected Date is required",
	}),
});

// Refactor the schema for the payload or reference
// shape to include the request schema
const ReferenceShape = z.object({
	graduateId: z.custom<Types.ObjectId>(),
	lecturerId: z.custom<Types.ObjectId>(),
	purposeOfReference: z.enum(["postgraduate-study", "scholarship", "job"]),
	graduationYear: z.string({ required_error: "Graduation Year is required" }),
	requests: z
		.array(requestSchema, {
			invalid_type_error: "Invalid request type received for 'requests'",
			required_error: "Requests field is required",
		})
		.min(1, "At least one request is required"),
	quantity: z
		.number({ required_error: "Quantity is required" })
		.int()
		.min(1, "At least 1 request is required"),
});

const RespondToReference = z.object({
	refId: z.custom<Types.ObjectId>(),
	accepted: z.string(),
});

const submitRequestedReference = z.object({
	refId: z.custom<Types.ObjectId>(),
	status: z.string(),
});

const BY_HUNDRED = 100;
const STATIC_AMOUNT = 30;
const TOTAL_AMOUNT = STATIC_AMOUNT * BY_HUNDRED;

export {
	SignUpShape,
	LoginShape,
	ReferenceShape,
	RespondToReference,
	submitRequestedReference,
	TOTAL_AMOUNT,
	STATIC_AMOUNT,
};
