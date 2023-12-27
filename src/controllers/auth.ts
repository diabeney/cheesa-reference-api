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

export const CHEESA_REFERNCE_JWT = "Cheesa-Reference-JWT";

async function handleSignUp(
  req: Request<unknown, unknown, IUser>,
  res: Response
) {
  const formObj = validateObject(req.body, SignUpShape);

  if (formObj instanceof ZodError) {
    const { message } = formObj.issues[0];
    return res.status(STATUS.BAD_REQUEST.code).json(ErrorMsg(400, message));
  }

  try {
    const { email, firstName, lastName, role, password } = formObj;
    const userExists = await getUserByEmail(email);

    if (userExists) {
      return res
        .status(STATUS.BAD_REQUEST.code)
        .json({ message: `User with email already exists` });
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
      res.status(STATUS.SERVER_ERROR.code).json({ message: error.message });
    }
    console.log(error);
    res.status(500).json(ErrorMsg(500));
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

    const { accessToken, refreshToken } = await generateTokens(payload);

    res.cookie(CHEESA_REFERNCE_JWT, refreshToken, {
      httpOnly: true,
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
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "30m",
      }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof JsonWebTokenError || error instanceof MongooseError) {
      return res.status(403).json({ message: error.message });
    }

    res.status(500).json(ErrorMsg(500));
  }
}

export { handleLogin, handleSignUp, handleRefreshToken };
