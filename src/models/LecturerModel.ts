import { Schema, model } from "mongoose";
import { ILecturer } from "../types";

const LecturerSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const Lecturer = model<ILecturer>("Lecturer", LecturerSchema);

export default Lecturer;
