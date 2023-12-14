import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) return res.sendStatus(401);

  const token = authorizationHeader.split(" ")[1];

  try {
    const _ = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
    next();
  } catch (err) {
    console.log(err);
    return res.sendStatus(403);
  }
}

export { verifyToken };
