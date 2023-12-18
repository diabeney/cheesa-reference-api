import jwt from "jsonwebtoken";
import { saveRefreshToken } from "../db/user";
import { Types } from "mongoose";
import { z, ZodError, ZodType } from "zod";

export type TokenPayload = {
  id: Types.ObjectId;
  email: string;
  role: string;
};

const STATUS = {
  CREATED: {
    code: 201,
    message: "Successfully Created",
  },
  BAD_REQUEST: {
    code: 400,
    message: "Bad Request",
  },
  INVALID_CREDENTIALS: {
    code: 401,
    message: "Invalid Credentials",
  },
  UNAUTHORIZED: {
    code: 403,
    message: "Not Authorized",
  },
  NOT_FOUND: {
    code: 404,
    message: "Not Found",
  },
  SERVER_ERROR: {
    code: 500,
    message: "Internal Server Error",
  },
};

async function generateTokens(payload: TokenPayload) {
  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "30m" }
  );
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d" }
  );

  try {
    await saveRefreshToken(payload.id, refreshToken);
  } catch (error) {
    console.log(error);
  }

  return { accessToken, refreshToken };
}

function validateObject<T = object>(
  payload: T,
  shape: ZodType<typeof payload>
): z.infer<typeof shape> | ZodError {
  try {
    const validObj = shape.parse(payload);
    return validObj;
  } catch (err) {
    if (err instanceof ZodError) {
      return err;
    }
    return new ZodError<typeof shape>([]);
  }
}

export function ErrorMsg(code: number, message?: string) {
  switch (code) {
    case STATUS.BAD_REQUEST.code:
      return { message: message || STATUS.BAD_REQUEST.message };

    case STATUS.INVALID_CREDENTIALS.code:
      return { message: message || STATUS.INVALID_CREDENTIALS.message };

    case STATUS.UNAUTHORIZED.code:
      return { message: message || STATUS.UNAUTHORIZED.message };

    case STATUS.NOT_FOUND.code:
      return { message: message || STATUS.NOT_FOUND.message };
    case STATUS.SERVER_ERROR.code:
      return { message: message || STATUS.SERVER_ERROR.message };

    default:
      return { message: message || STATUS.SERVER_ERROR.message };
  }
}

export { STATUS, generateTokens, validateObject };
