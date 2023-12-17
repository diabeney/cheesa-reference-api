import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/types";
import { TokenPayload } from "../utils";

function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) return res.sendStatus(401);

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload;
    req.userPayload = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
}

export { verifyToken };
