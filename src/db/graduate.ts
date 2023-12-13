import Gruaduate from "../models/GraduateModel";
import { IGraduate } from "../types";

const getGraduateByEmail = async (email: string) =>
  await Gruaduate.findOne({ email });
const createGraduate = async (values: IGraduate) =>
  new Gruaduate(values).save();
export { getGraduateByEmail, createGraduate };
