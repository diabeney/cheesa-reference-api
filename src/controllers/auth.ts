import { Request, Response } from "express";
import { IUser } from "../types/types";
import { getUserByEmail, createUser, getRefreshToken } from "../db/user";
import { ErrorMsg, generateTokens, validateObject } from "../utils";
import { STATUS } from "../utils";
import bcrypt from "bcryptjs";
import { MongooseError } from "mongoose";
import { AuthCookies } from "../types/types";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { TokenPayload } from "../utils";
import { SignUpShape, LoginShape } from "../constants/constants";
import { ZodError } from "zod";
import crypto from "crypto";
import Verification from "../models/verificationModel";
import { EmailVerificationMessage } from "../utils/emailTemplate";
import { sendVerificationEmail } from "../utils/sendVerificationEmail";

export const CHEESA_REFERNCE_JWT = "Cheesa-Reference-JWT";

async function handleSignUp(
  req: Request<
    unknown,
    unknown,
    Omit<IUser, "isVerified" | "getResetPasswordToken">
  >,
  res: Response
) {
  const formObj = validateObject(req.body, SignUpShape);

  if (formObj instanceof ZodError) {
    const { message } = formObj.issues[0];
    return res.status(STATUS.BAD_REQUEST.code).json(ErrorMsg(400, message));
  }

  try {
    const {
      email,
      firstName,
      lastName,
      role,
      password,
      referenceNumber,
      indexNumber,
    } = formObj;

    const userExists = await getUserByEmail(email);

    if (userExists) {
      return res
        .status(400)
        .json(ErrorMsg(400, "User with this email already exists"));
    }

    const SALT_FACTOR = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, SALT_FACTOR);

    const user = await createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      referenceNumber,
      indexNumber,
    });

    // Generate a unique verification token
    const token = crypto.randomBytes(64).toString("hex");

    // Create verification token document
    await Verification.create({ token, userId: user._id });

    // Create verification URL
    const verificationURL = `${process.env.CLIENT_URL}/verify/${token}`;
    const message = EmailVerificationMessage(verificationURL, user);

    const dispatchedMessage = sendVerificationEmail({
      to: user.email,
      subject: "Email Verification",
      message,
    });

    if (!dispatchedMessage) return res.status(500).json(ErrorMsg(500));

    await dispatchedMessage;

    res
      .status(200)
      .json(ErrorMsg(200, `Verification email sent to ${user.email}`));
  } catch (error) {
    if (error instanceof MongooseError) {
      res.status(500).json(ErrorMsg(500));
    }
    console.log(error);
    res.status(500).json(ErrorMsg(500, "Error creating an account"));
  }
}

async function handleLogin(
  req: Request<unknown, unknown, Pick<IUser, "email" | "password">>,
  res: Response
) {
  const formObj = validateObject(req.body, LoginShape);

  if (formObj instanceof ZodError) {
    const { message } = formObj.issues[0];
    return res.status(STATUS.BAD_REQUEST.code).json(ErrorMsg(400, message));
  }

  const { email, password } = formObj;

  try {
    const user = await getUserByEmail(email);

    if (!user) return res.status(404).json(ErrorMsg(404));

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) return res.status(401).json(ErrorMsg(401));

    const payload = { id: user._id, email: user.email, role: user.role };

    const tokens = await generateTokens(payload);

    if (tokens instanceof Error) return res.status(500).json(ErrorMsg(500));

    const { refreshToken, accessToken } = tokens;

    res.cookie(CHEESA_REFERNCE_JWT, refreshToken, {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json(ErrorMsg(500));
  }
}

async function handleRefreshToken(req: Request, res: Response) {
  const cookies = req.cookies as AuthCookies;
  const refreshToken = cookies["Cheesa-Reference-JWT"];

  if (!refreshToken) return res.sendStatus(401);

  try {
    const payload = jwt.decode(refreshToken) as TokenPayload;

    const storedRefreshToken = await getRefreshToken(payload.id);

    if (!storedRefreshToken) return res.status(403).json(ErrorMsg(403));

    const verifiedPayload =
      storedRefreshToken.token === refreshToken &&
      (jwt.verify(
        storedRefreshToken.token,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as TokenPayload);

    if (verifiedPayload === false) return res.status(403).json(ErrorMsg(403));

    const newAccessToken = jwt.sign(
      verifiedPayload,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof JsonWebTokenError || error instanceof MongooseError) {
      return res.status(403).json({ message: error.message });
    }
    console.log(error);

    res.status(500).json(ErrorMsg(500));
  }
}

export { handleLogin, handleSignUp, handleRefreshToken };
