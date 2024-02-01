import Users from "../models/userModel";
import RefreshToken from "../models/refresh";
import { Types } from "mongoose";
import { IUser } from "../types/types";
import { Request, Response } from "express";

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
			indexNumber: user.indexNumber,
			referenceNumber: user.referenceNumber,
			programme: user.programme,
			entryYear: user.entryYear,
			graduationYear: user.graduationYear,
			projects: user.projects,
			nss: user.nss,
			telephone: user.telephone,
			isVerified: user.isVerified,
			cwa: user.cwa,
			rankInClass: user.rankInClass,
			numberOfGraduatedClass: user.numberOfGraduatedClass,
			classObtained: user.classObtained,
			signature: user.signature,
		})),
	);

const getAllUsers = async () =>
	await Users.find().then((users) =>
		users.map((user) => ({
			id: user._id,
			role: user.role,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			programme: user.programme,
			indexNumber: user.indexNumber,
			referenceNumber: user.referenceNumber,
			entryYear: user.entryYear,
			graduationYear: user.graduationYear,
			projects: user.projects,
			nss: user.nss,
			telephone: user.telephone,
			placeOfWork: user.placeOfWork,
			isVerified: user.isVerified,
			cwa: user.cwa,
			rankInClass: user.rankInClass,
			numberOfGraduatedClass: user.numberOfGraduatedClass,
			classObtained: user.classObtained,
			signature: user.signature,
		})),
	);

const createUser = (userObject: Partial<IUser>) => new Users(userObject).save();

// Update some user fields after signing up
const handleUpdateUser = async (req: Request, res: Response) => {
	const { userId } = req.params;

	const { entryYear, graduationYear, telephone, nss, placeOfWork, projects } =
		req.body;

	const findUser = await Users.findById(userId);

	if (!findUser) return res.status(404).json({ message: "User not found" });

	await Users.updateOne(
		{ _id: userId },
		{
			$set: {
				entryYear,
				graduationYear,
				telephone,
				nss,
				placeOfWork,
				projects,
			},
		},
		{ upsert: true, new: true },
	);

	res.status(200).json({ message: "User records updated successfully" });
};

const getRefreshToken = async (id: Types.ObjectId) =>
	await RefreshToken.findOne({ userId: id });

const saveRefreshToken = async (userId: Types.ObjectId, token: string) => {
	try {
		const _ = await RefreshToken.findOneAndDelete({ userId });
		const __ = new RefreshToken({ userId, token }).save();
		return;
	} catch (error) {
		console.log(error);
	}
};

export { getUserByEmail, createUser, getRefreshToken, saveRefreshToken };

export { getUserByRole, getAllUsers, getLecturerById, handleUpdateUser };
