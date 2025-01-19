import { Schema, model } from "mongoose";
import { IUser } from "../types/types";
import crypto from "crypto";

const UsersSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["lecturer", "graduate", "admin"] },
  referenceNumber: { type: String, required: false },
  indexNumber: { type: String, required: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  programme: String,
  entryYear: String,
  graduationYear: String,
  projects: {
    thirdYear: {
      title: String,
      supervisor: String,
    },
    finalYear: {
      title: String,
      supervisor: String,
    },
  },
  availability: {
    isAvailable: { type: Boolean, default: false },
    from: { type: String, required: false },
    to: { type: String, required: false },
  },
  nss: String,
  placeOfWork: String,
  telephone: String,
  cwa: String,
  rankInClass: String,
  numberOfGraduatedClass: String,
  classObtained: String,
  signature: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UsersSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 10 * (60 * 1000); //Ten Minutes

  return resetToken;
};

const Users = model<IUser>("Users", UsersSchema);

export default Users;
