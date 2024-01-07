import Users from "../models/userModel";
import RefreshToken from "../models/refresh";
import { Types } from "mongoose";
import { IUser } from "../types/types";

const getUserByEmail = async (email: string) => await Users.findOne({ email });
const getLecturerById = async (id: Types.ObjectId) =>
  await Users.findOne({ _id: id, role: "lecturer" });

const getUserByRole = async (role: string) =>
  await Users.find({ role }).then((users) =>
    users.map((user) => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    }))
  );

const getAllUsers = async () =>
  await Users.find().then((users) =>
    users.map((user) => ({
      id: user._id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }))
  );

const createUser = (userObject: IUser) => new Users(userObject).save();

const getRefreshToken = async (id: Types.ObjectId) =>
  await RefreshToken.findOne({ userId: id });

const saveRefreshToken = async (userId: Types.ObjectId, token: string) => {
  try {
    const oldToken = await RefreshToken.findOneAndDelete({ userId });
    const newToken = new RefreshToken({ userId, token }).save();
    return;
  } catch (error) {
    console.log(error);
  }
};

export { getUserByEmail, createUser, getRefreshToken, saveRefreshToken };

export { getUserByRole, getAllUsers, getLecturerById };
