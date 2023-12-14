import Users from "../models/userModel";
import { IUser } from "../types";

const getUserByEmail = async (email: string) => await Users.findOne({ email });
const createUser = (userObject: IUser) => new Users(userObject).save();

export { getUserByEmail, createUser };
