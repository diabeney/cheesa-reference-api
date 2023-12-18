import { z } from "zod";

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

export { SignUpShape, LoginShape };
