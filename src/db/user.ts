import Users from "../models/userModel";
import RefreshToken from "../models/refresh";
import { Types } from "mongoose";
import { IUser } from "../types/types";

const getUserByEmail = async (email: string) => await Users.findOne({ email });
const createUser = (userObject: IUser) => new Users(userObject).save();

const getRefreshToken = async (id: Types.ObjectId) =>
  await RefreshToken.findOne({ userId: id });
const saveRefreshToken = (userId: Types.ObjectId, token: string) =>
  new RefreshToken({ userId, token }).save();

export { getUserByEmail, createUser, getRefreshToken, saveRefreshToken };
