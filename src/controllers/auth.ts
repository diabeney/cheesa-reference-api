import { Request, Response } from "express";
import { IUser } from "../types";
import { getUserByEmail, createUser } from "../db/user";
import { generateTokens, validateReqObject } from "../utils";
import {} from "../db/user";
import { STATUS } from "../utils";
import bcrypt from "bcryptjs";
import { MongooseError } from "mongoose";

export const CHEESA_REFERNCE_JWT = "Cheesa-Reference-JWT";

async function SignUp(req: Request<unknown, unknown, IUser>, res: Response) {
  const formObj = validateReqObject(req.body, [
    "firstName",
    "email",
    "lastName",
    "password",
    "role",
  ]);

  if (formObj instanceof Error) {
    return res.sendStatus(STATUS.BAD_REQUEST.code);
  }

  try {
    const { email, firstName, lastName, role, password } = formObj;
    const userExists = await getUserByEmail(email);

    if (userExists) {
      return res
        .status(STATUS.BAD_REQUEST.code)
        .json({ message: "User with email already exists" });
    }

    const SALT_FACTOR = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, SALT_FACTOR);

    await createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    res.sendStatus(STATUS.CREATED.code);
  } catch (error) {
    if (error instanceof MongooseError) {
      res.status(STATUS.SERVER_ERROR.code).json(error.message);
    }
    console.log(error);
    res.sendStatus(500);
  }
}

async function login(req: Request, res: Response) {
  const formObj = validateReqObject<Pick<IUser, "email" | "password">>(
    req.body,
    ["email", "password"]
  );

  if (formObj instanceof Error) {
    return res.sendStatus(STATUS.BAD_REQUEST.code);
  }

  const { email, password } = formObj;
  try {
    const user = await getUserByEmail(email);

    if (!user) return res.sendStatus(404);

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) return res.sendStatus(400);

    const payload = { id: user._id, email: user.email, role: user.role };

    const { accessToken, refreshToken } = generateTokens(payload);

    res.cookie(CHEESA_REFERNCE_JWT, refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export { SignUp, login };
