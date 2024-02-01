import { Request, Response } from "express";
import { AuthRequest } from "../types/types";
import { getUserByEmail } from "../db/user";
import { getUserByRole } from "../db/user";
import { getAllUsers } from "../db/user";
import { ErrorMsg } from "../utils";
import Users from "../models/userModel";

async function handleGetLoggedInUser(req: AuthRequest, res: Response) {
	const user = req.userPayload;

	try {
		if (user) {
			const { email } = user;
			const foundUser = await getUserByEmail(email);

			if (!foundUser) return res.status(404).json(ErrorMsg(400));
			const {
				_id,
				firstName,
				lastName,
				role,
				email: userEmail,
				entryYear,
				graduationYear,
				indexNumber,
				referenceNumber,
				programme,
				projects,
				placeOfWork,
				nss,
				telephone,
				isVerified,
			} = foundUser;

			return res.status(200).json({
				id: _id,
				firstName,
				lastName,
				role,
				email: userEmail,
				entryYear,
				graduationYear,
				indexNumber,
				referenceNumber,
				programme,
				projects,
				placeOfWork,
				nss,
				telephone,
				isVerified,
			});
		}
		return res.status(401).json(ErrorMsg(401));
	} catch (error) {
		console.log(error);
		res.status(500).json(ErrorMsg(500));
	}
}

async function handleGetUsers(req: AuthRequest, res: Response) {
	const searchParam = req.query;
	const isEmptyObj = Object.keys(searchParam).length === 0;
	try {
		if (isEmptyObj) {
			const users = await getAllUsers();
			if (!users) return res.sendStatus(404);
			return res.status(200).json({ results: users });
		}

		const role = searchParam.role as string;

		const lecturers = await getUserByRole(role);

		if (!lecturers.length) return res.sendStatus(404);

		res.status(200).json({ results: lecturers });
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

async function handleAdminUpdateUser(req: Request, res: Response) {
	try {
		const { userId } = req.params;
		const {
			signature,
			rankInClass,
			classObtained,
			numberOfGraduatedClass,
			cwa,
		} = req.body;
		const findUser = await Users.findById(userId);

		if (!findUser) return res.status(404).json({ message: "User not found" });

		await Users.updateOne(
			{ _id: userId },
			{
				$set: {
					signature,
					rankInClass,
					classObtained,
					numberOfGraduatedClass,
					cwa,
				},
			},
			{ upsert: true, new: true },
		);

		res.status(200).json({ message: "User bluesheet updated successfully" });
	} catch (error) {
		console.log(error);
	}
}

async function handleDeleteUser(req: Request, res: Response) {
	try {
		const { userId } = req.params;
		const foundUser = await Users.findById(userId);

		if (!foundUser) return res.status(404).json(ErrorMsg(404));
		if (foundUser.role === "lecturer") {
			await Users.deleteOne({ _id: userId });
			return res.status(200).json({ message: "Lecturer deleted successfully" });
		}
		return res
			.status(400)
			.json(ErrorMsg(400, 'Only "lecturer" can be deleted'));
	} catch (error) {
		console.log(error);
		res.status(500).json(ErrorMsg(500));
	}
}

export {
	handleGetLoggedInUser,
	handleGetUsers,
	handleDeleteUser,
	handleAdminUpdateUser,
};
