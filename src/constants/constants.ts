import { z } from "zod";
import { Types } from "mongoose";

const SignUpShape = z.object({
  firstName: z.string({ required_error: "First Name is required" }),
  lastName: z.string({ required_error: "Last Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["lecturer", "graduate", "admin"]),
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
	address: z.string({
		required_error: "Address is required",
	}),
	description: z.string().optional(),
	modeOfPostage: z.enum(["online", "hard-copy", "scanned-letter"]),
});

// Refactor the schema for the payload or reference
// shape to include the request schema
const ReferenceShape = z.object({
	graduateId: z.custom<Types.ObjectId>(),
	lecturerId: z.custom<Types.ObjectId>(),
	refPaymentId: z.custom<Types.ObjectId>().optional(),
	purposeOfReference: z.enum(["postgraduate-study", "scholarship", "job"]),
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

const adminUpdateShape = z.object({
	signature: z.string({ required_error: "Signature is required" }),
	rankInClass: z.string({ required_error: "Rank in class is required" }),
	classObtained: z.string({ required_error: "Class obtained is required" }),
	numberOfGraduatedClass: z.string({
		required_error: "Number of graduated class is required",
	}),
	cwa: z.string({ required_error: "CWA is required" }),
});

const ProjectsShape = z.object({
	title: z.string(),
	supervisor: z.string(),
});

const updateUserInfoShape = z.object({
	entryYear: z.string({ required_error: "Entry year is required" }),
	graduationYear: z.string({ required_error: "Graduation year is required" }),
	telephone: z.string({ required_error: "Telephone is required" }),
	nss: z.string({ required_error: "NSS is required" }),
	placeOfWork: z.string({ required_error: "Place of work is required" }),
	projects: z.object({
		thirdYear: ProjectsShape,
		finalYear: ProjectsShape,
	}),
});

const handleUpdateLecturerInfoShape = z.object({
	availability: z.object({
		isAvailable: z.boolean(),
		from: z.string().optional(),
		to: z.string().optional(),
	}),
});

const BY_HUNDRED = 100;
const STATIC_AMOUNT = 30;
const ADDONS = 50 * BY_HUNDRED;
const TOTAL_AMOUNT = STATIC_AMOUNT * BY_HUNDRED;

export {
	SignUpShape,
	LoginShape,
	ReferenceShape,
	adminUpdateShape,
	updateUserInfoShape,
	handleUpdateLecturerInfoShape,
	RespondToReference,
	submitRequestedReference,
	TOTAL_AMOUNT,
	STATIC_AMOUNT,
	ADDONS,
};
