import { Request, Response } from "express";
import { AuthRequest } from "../types/types";
import { getUserByEmail } from "../db/user";
import { getUserByRole } from "../db/user";
import { getAllUsers } from "../db/user";
import { ErrorMsg, STATUS, validateObject } from "../utils";
import Users from "../models/userModel";
import { adminUpdateShape } from "../constants/constants";
import { ZodError } from "zod";
import { submitRequestEmail } from "../utils/sendEmail";
import { requestUpdateMessage } from "../utils/emailTemplate";
import Reference from "../models/reference";
import LecturerEmails from "../models/lecturerEmails";

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
				availability,
				placeOfWork,
				nss,
				telephone,
				isVerified,
				cwa,
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
				availability,
				placeOfWork,
				nss,
				telephone,
				isVerified,
				cwa,
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
	const formObj = validateObject(req.body, adminUpdateShape);

	if (formObj instanceof ZodError) {
		const { message } = formObj.issues[0];
		return res.status(STATUS.BAD_REQUEST.code).json(ErrorMsg(400, message));
	}

	try {
		const { userId } = req.params;
		const {
			signature,
			rankInClass,
			classObtained,
			numberOfGraduatedClass,
			cwa,
		} = formObj;
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

		res
			.status(200)
			.json({ message: "User official details updated successfully" });

		// Send email to the graduate if admin has updated the bluesheet
		const graduate = await Users.findById(userId);

		if (!graduate) return res.status(404).json(ErrorMsg(404));

		const { email, firstName, lastName } = graduate;

		// Send email to the graduate
		const graduateInfo = {
			name: `${firstName} ${lastName}`,
			email,
		};

		const templateHandler = requestUpdateMessage(graduateInfo);
		const dispatchedMessages = submitRequestEmail({
			to: graduateInfo.email,
			subject: "Official Details Updated",
			message: templateHandler,
		});

		await dispatchedMessages;

		console.log(
			"\x1b[32m✓ \x1b[35m%s\x1b[0m",
			`[Evans] Bluesheet Updated Email sent to ${graduateInfo.email}`,
		);
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
			// Delete all documents associated with the user account deleted

			await Reference.deleteMany({ lecturerId: userId });

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

async function addLecturerEmails(req: Request, res: Response) {
	const { email } = req.body;

	try {
		const emailExist = await LecturerEmails.findOne({ email });

		if (emailExist) {
			return res.status(404).json(ErrorMsg(404, "Email already exist"));
		}

		const newEmail = await LecturerEmails.create({ email });

		if (!newEmail) {
			return res.status(500).json(ErrorMsg(500));
		}

		res.status(200).json({ message: "Email added successfully" });
	} catch (error) {
		if (error instanceof Error) {
			console.log(error.message);
		}
	}
}

export {
	handleGetLoggedInUser,
	handleGetUsers,
	handleDeleteUser,
	handleAdminUpdateUser,
	addLecturerEmails,
};
