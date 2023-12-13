import Lecturer from "../models/LecturerModel";
import { ILecturer } from "../types";

const getLecturerByEmail = async (email: string) =>
  await Lecturer.findOne({ email });
const createLecturer = async (values: ILecturer) => new Lecturer(values).save();
export { getLecturerByEmail, createLecturer };
