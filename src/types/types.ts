import { CookieOptions, Request } from "express";
import { TokenPayload } from "../utils";

export type Programmes = "Petrochemical" | "Chemical";

export type IUser = Record<
  "firstName" | "lastName" | "email" | "password" | "role",
  string
>;

export interface IRecommendationRequest {
  user: Omit<IUser, "password" | "role">;
  programme: Programmes;
  graduationYear: string;
}

export interface AuthCookies extends CookieOptions {
  "Cheesa-Reference-JWT": string;
}

export interface AuthRequest extends Request {
  userPayload?: TokenPayload;
}
