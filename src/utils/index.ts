import jwt from "jsonwebtoken";
import { saveRefreshToken } from "../db/user";
import { Types } from "mongoose";

export type TokenPayload = {
	id: Types.ObjectId;
	email: string;
	role: string;
};

function validateReqObject<T = object>(
	obj: Partial<T>,
	requiredFields: (keyof T)[],
) {
	const isInvalid = requiredFields.some(
		(field) => Object.keys(obj).indexOf(field as string) === -1 || !obj[field],
	);

	if (isInvalid) {
		return new Error("Bad Request");
	}
	return obj as T;
}

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
		{ expiresIn: "5m" },
	);
	const refreshToken = jwt.sign(
		payload,
		process.env.REFRESH_TOKEN_SECRET as string,
		{ expiresIn: "1d" },
	);

	try {
		await saveRefreshToken(payload.id, refreshToken);
	} catch (error) {
		console.log(error);
	}

	return { accessToken, refreshToken };
}

export { validateReqObject, STATUS, generateTokens };
