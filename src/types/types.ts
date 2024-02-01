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
export type PurposeOfReference = "postgraduate-study" | "scholarship" | "job";

export type resetToken = string;

export type Projects = {
  title: string;
  supervisor: string;
};

export type IUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  programme?: string;
  entryYear?: string;
  graduationYear?: string;
  projects?: {
    year: Projects;
  };
  nss?: string;
  placeOfWork?: string;
  telephone?: string;
  referenceNumber: string;
  indexNumber?: string;
  isVerified?: boolean;
  resetPasswordToken?: resetToken;
  resetPasswordExpires?: Date;
};

export interface RequestReference {
  quantity: number;
  graduateId: Types.ObjectId;
  lecturerId: Types.ObjectId;
  purposeOfReference: PurposeOfReference;
  requests: {
    destination: string;
    expectedDate: string;
    address: string;
    modeOfPostage: string;
  }[];
}

export interface IReferenceRequest {
  id?: Types.ObjectId;
  graduateId: Types.ObjectId;
  lecturerId: Types.ObjectId;
  destination: string;
  expectedDate: string | Date;
  transactionStatus?: TransactionStatus;
  status?: "not ready" | "submitted";
  accepted?: "accepted" | "declined" | "null";
}

export interface AuthCookies extends CookieOptions {
  "Cheesa-Reference-JWT": string;
}

export interface AuthRequest extends Request {
  userPayload?: TokenPayload;
}

export type Options = {
  to: string | undefined;
  subject: string;
  message: string;
};

export type ReferenceResponse = {
  destination: string;
  status: string;
  _id: Types.ObjectId;
  expectedDate: string;
  purposeOfReference?: string;
  lecturerId: {
    firstName: string;
    lastName: string;
    email: string;
  };
  graduateId: {
    firstName: string;
    lastName: string;
    email: string;
    programme: string;
  };
};
