import { Types } from "mongoose";
import Reference from "../models/reference";
import { IReferenceRequest } from "../types/types";

const RequestReference = async (payload: IReferenceRequest) =>
  await new Reference(payload).save();

const getReferenceById = async (id: string, role: "lecturer" | "graduate") => {
  if (role === "graduate") {
    const result = await Reference.find({ graduateId: id }).then(
      (reference) => {
        return reference.map((reference) => ({
          id: reference._id,
          graduateId: reference.graduateId,
          lecturerId: reference.lecturerId,
          programme: reference.programme,
          graduationYear: reference.graduationYear,
          referenceNumber: reference.referenceNumber,
          indexNumber: reference.indexNumber,
          expectedDate: reference.expectedDate,
          transactionStatus: reference.transactionStatus,
          createdAt: reference.createdAt,
          accepted: reference.accepted,
          status: reference.status,
        }));
      }
    );
    return result;
  }

  const result = await Reference.find({ lecturerId: id }).then((reference) => {
    return reference.map((reference) => ({
      id: reference._id,
      graduateId: reference.graduateId,
      lecturerId: reference.lecturerId,
      programme: reference.programme,
      graduationYear: reference.graduationYear,
      referenceNumber: reference.referenceNumber,
      indexNumber: reference.indexNumber,
      expectedDate: reference.expectedDate,
      createdAt: reference.createdAt,
      accepted: reference.accepted,
      transactionStatus: reference.transactionStatus,
      status: reference.status,
    }));
  });
  return result;
};

const updateReferenceById = async (
  id: Types.ObjectId,
  payload: Pick<IReferenceRequest, "accepted">
) => await Reference.findOneAndUpdate({ _id: id }, payload, { new: true });

export { RequestReference, getReferenceById, updateReferenceById };
