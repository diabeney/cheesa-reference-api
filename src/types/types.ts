import { CookieOptions, Request } from "express";
import { TokenPayload } from "../utils";
import { Types } from "mongoose";

export type TransactionStatus = "pending" | "paid";

export type Transaction = {
  id: string;
  dateInitatiad: Date;
  status: TransactionStatus;
};
export type Programmes = "petrochemical" | "chemical";

export type IUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  referenceNumber: string;
  indexNumber?: string;
};


export interface IReferenceRequest {
  id?: Types.ObjectId
  graduateId: Types.ObjectId
  lecturerId: Types.ObjectId
  programme: Programmes
  graduationYear: string
  destination: string
  expectedDate: string | Date
  transactionStatus?: TransactionStatus
  status?: 'not ready' | 'submitted'
  accepted?: 'accepted' | 'declined' | 'null'
}

export interface AuthCookies extends CookieOptions {
  "Cheesa-Reference-JWT": string;
}

export interface AuthRequest extends Request {
  userPayload?: TokenPayload;
}

export type Options = {
  to: string;
  subject: string;
  message: string;
};
