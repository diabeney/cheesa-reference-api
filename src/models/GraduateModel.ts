import { Schema, model } from "mongoose";

const GraduateSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  programme: {
    type: String,
    enum: ["Chemical", "Petrochemical"],
  },
  graduationYear: {
    type: String,
    required: true,
  },
});

const GruaduateModel = model("Graduate", GraduateSchema);
