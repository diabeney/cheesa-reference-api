import { Schema, model } from "mongoose";
import { IGraduate } from "../types";

const GraduateSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  programme: {
    type: String,
    enum: ["Chemical", "Petrochemical"],
  },
  graduationYear: {
    type: String,
    required: true,
  },
});

const Graduate = model<IGraduate>("Graduate", GraduateSchema);

export default Graduate;
