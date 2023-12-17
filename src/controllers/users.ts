import { Response } from "express";
import { AuthRequest } from "../types/types";
import { IUser } from "../types/types";
import { getUserByEmail } from "../db/user";

async function handleGetLoggedInUser(req: AuthRequest, res: Response) {
  const user = req.userPayload;

  try {
    if (user) {
      const { email } = user;
      const foundUser = await getUserByEmail(email);

      if (!foundUser) return res.sendStatus(404);
      const { _id, firstName, lastName, role, email: userEmail } = foundUser;

      return res.status(200).json({
        id: _id,
        firstName,
        lastName,
        role,
        email: userEmail,
      });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { handleGetLoggedInUser };
