import { Request, Response } from "express";
import { IGraduate, ILecturer } from "../types";
import { validateReqObject } from "../utils";
import { getGraduateByEmail, createGraduate } from "../db/graduate";
import { getLecturerByEmail, createLecturer } from "../db/lecturer";
import { STATUS } from "../utils";
import bcrypt from "bcryptjs";

async function graduateSignup(
  req: Request<unknown, unknown, IGraduate>,
  res: Response
) {
  const formObj = validateReqObject(req.body, [
    "email",
    "firstName",
    "lastName",
    "graduationYear",
    "programme",
    "password",
  ]);

  if (formObj instanceof Error) {
    return res.sendStatus(STATUS.BAD_REQUEST.code);
  }

  try {
    const { email, firstName, lastName, graduationYear, programme, password } =
      formObj;
    const userExists = await getGraduateByEmail(email);

    if (userExists) {
      return res
        .status(STATUS.BAD_REQUEST.code)
        .json({ message: "User with email already exists" });
    }

    const SALT_FACTOR = 10;

    const hashedPassword = await bcrypt.hash(password, SALT_FACTOR);

    await createGraduate({
      firstName,
      lastName,
      email,
      graduationYear,
      programme,
      password: hashedPassword,
    });

    res.sendStatus(STATUS.CREATED.code);
  } catch (error) {
    console.log(error);
    res.sendStatus(STATUS.SERVER_ERROR.code);
  }
}

async function lecturerSignup(
  req: Request<unknown, unknown, ILecturer>,
  res: Response
) {
  const formObj = validateReqObject(req.body, [
    "email",
    "firstName",
    "lastName",
    "password",
  ]);

  if (formObj instanceof Error) {
    return res.sendStatus(STATUS.BAD_REQUEST.code);
  }

  try {
    const { email, firstName, lastName, password } = formObj;
    const userExists = await getLecturerByEmail(email);

    if (userExists) {
      return res
        .status(STATUS.BAD_REQUEST.code)
        .json({ message: "User with email already exists" });
    }

    const SALT_FACTOR = 10;

    const hashedPassword = await bcrypt.hash(password, SALT_FACTOR);

    await createLecturer({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.sendStatus(STATUS.CREATED.code);
  } catch (error) {
    console.log(error);
    res.sendStatus(STATUS.SERVER_ERROR.code);
  }
}

export { graduateSignup, lecturerSignup };
