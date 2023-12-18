import mongoose from "mongoose";

const ReferenceSchema = new mongoose.Schema({
  graduateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lecturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  programme: {
    type: String,
    required: true,
  },
  graduationYear: {
    type: String,
    reuquired: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reference = mongoose.model("Reference", ReferenceSchema);

export default Reference;
