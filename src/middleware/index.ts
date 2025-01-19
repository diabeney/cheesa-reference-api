import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/types";
import { ErrorMsg, TokenPayload } from "../utils";

function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader)
    return res.status(401).json(ErrorMsg(401, "No authorization header"));

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
    return res.status(401).json(ErrorMsg(401, "Not authorised"));
  }
}

// Super Admin middleware
function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.userPayload?.role !== "admin")
    return res
      .status(403)
      .json(
        ErrorMsg(403, "Permission denied! Only admins can perform this action")
      );
  next();
}
export { verifyToken, isAdmin };
