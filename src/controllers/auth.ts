import { Request, Response } from "express";
import { IUser } from "../types/types";
import { getUserByEmail, createUser, getRefreshToken } from "../db/user";
import { generateTokens, validateReqObject } from "../utils";
import { STATUS } from "../utils";
import bcrypt from "bcryptjs";
import { MongooseError } from "mongoose";
import { AuthCookies } from "../types/types";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { TokenPayload } from "../utils";

export const CHEESA_REFERNCE_JWT = "Cheesa-Reference-JWT";

async function handleSignUp(
  req: Request<unknown, unknown, IUser>,
  res: Response
) {
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

async function handleLogin(req: Request, res: Response) {
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

    const { accessToken, refreshToken } = await generateTokens(payload);

    res.cookie(CHEESA_REFERNCE_JWT, refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function handleRefreshToken(req: Request, res: Response) {
  const cookies = req.cookies as AuthCookies;
  const refreshToken = cookies["Cheesa-Reference-JWT"];

  if (!refreshToken) return res.sendStatus(401);

  try {
    const payload = jwt.decode(refreshToken) as TokenPayload;

    const storedRefreshToken = await getRefreshToken(payload.id);

    if (!storedRefreshToken) return res.sendStatus(401);

    const verifiedPayload =
      storedRefreshToken.token === refreshToken &&
      (jwt.verify(
        storedRefreshToken.token,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as TokenPayload);

    if (verifiedPayload === false) return res.sendStatus(403);

    const newAccessToken = jwt.sign(
      verifiedPayload,
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "5m",
      }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    if (error instanceof JsonWebTokenError || error instanceof MongooseError) {
      return res.status(403).json({ message: error.message });
    }

    res.sendStatus(500);
  }
}

export { handleLogin, handleSignUp, handleRefreshToken };
