import { Types } from "mongoose";
import Reference from "../models/reference";
import Users from "../models/userModel";
import { IReferenceRequest } from "../types/types";
import Payments from "../models/paymentModel";

const RequestReference = async (payload: IReferenceRequest) =>
	await new Reference(payload).save();

const getReferenceById = async (id: string) => {
	const result = await Reference.findOne({ _id: id })
		.populate({
			path: "graduateId lecturerId",
			select:
				"firstName lastName email indexNumber referenceNumber programme entryYear graduationYear cwa rankInClass classObtained numberOfGraduatedClass nss placeOfWork telephone projects",
			model: Users,
		})
		.sort({ _id: -1 })
		.then((reference) => {
			if (reference) {
				return {
					id: reference._id,
					graduateInfo: reference.graduateId,
					lecturer: reference.lecturerId,
					purposeOfReference: reference.purposeOfReference,
					destination: reference.destination,
					address: reference.address,
					expectedDate: reference.expectedDate,
					transactionStatus: reference.transactionStatus,
					createdAt: reference.createdAt,
					accepted: reference.accepted,
					status: reference.status,
					modeOfPostage: reference.modeOfPostage,
				};
			}
		});
	return result;
};

const getUsersReferenceByRole = async (
	id: string,
	role: "lecturer" | "graduate",
) => {
	if (role === "graduate") {
		const result = await Reference.find({ graduateId: id })
			.populate({
				path: "graduateId lecturerId",
				select:
					"indexNumber referenceNumber programme entryYear graduationYear",
				model: Users,
			})
			.populate({
				path: "paymentId",
				select: "amount",
				model: Payments,
			})
			.sort({ _id: -1 })
			.then((reference) => {
				return reference.map((reference) => ({
					id: reference._id,
					graduateInfo: reference.graduateId,
					lecturer: reference.lecturerId,
					purposeOfReference: reference.purposeOfReference,
					destination: reference.destination,
					address: reference.address,
					expectedDate: reference.expectedDate,
					transactionStatus: reference.transactionStatus,
					createdAt: reference.createdAt,
					accepted: reference.accepted,
					status: reference.status,
				}));
			});
		return result;
	}

	const result = await Reference.find({ lecturerId: id })
		.populate({
			path: "lecturerId graduateId",
			select:
				"referenceNumber indexNumber firstName lastName programme entryYear graduationYear",
			model: Users,
		})
		.populate({
			path: "paymentId",
			select: "amount",
			model: Payments,
		})
		.sort({ _id: -1 })
		.then((reference) => {
			return reference.map((reference) => ({
				id: reference._id,
				graduateInfo: reference.graduateId,
				lecturer: reference.lecturerId,
				purposeOfReference: reference.purposeOfReference,
				destination: reference.destination,
				address: reference.address,
				expectedDate: reference.expectedDate,
				transactionStatus: reference.transactionStatus,
				createdAt: reference.createdAt,
				accepted: reference.accepted,
				status: reference.status,
			}));
		});
	return result;
};

const updateReferenceById = async (
	id: Types.ObjectId,
	payload: Pick<IReferenceRequest, "accepted">,
) => await Reference.findOneAndUpdate({ _id: id }, payload, { new: true });

export {
	RequestReference,
	getUsersReferenceByRole,
	updateReferenceById,
	getReferenceById,
};
