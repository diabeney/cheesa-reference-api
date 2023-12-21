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
});

const LoginShape = SignUpShape.pick({ email: true, password: true });

const ReferenceShape = z.object({
  graduateId: z.custom<Types.ObjectId>(),
  lecturerId: z.custom<Types.ObjectId>(),
  programme: z.enum(["chemical", "petrochemical"]),
  graduationYear: z.string({ required_error: "Graduation Year is required" }),
  referenceNumber: z
    .string({ required_error: "Reference Number is required" })
    .min(8, "Reference should be at least 8 characters"),
  indexNumber: z
    .string({ required_error: "Index number is required" })
    .min(7, "Index number should be at least 8 characters"),
  expectedDate: z.string(),
});

const RespondToReference = z.object({
  refId: z.custom<Types.ObjectId>(),
  accepted: z.string(),
});

export { SignUpShape, LoginShape, ReferenceShape, RespondToReference };
