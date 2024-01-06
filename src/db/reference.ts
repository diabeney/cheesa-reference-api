import { Types } from 'mongoose'
import Reference from '../models/reference'
import Users from '../models/userModel'
import { IReferenceRequest } from '../types/types'

const RequestReference = async (payload: IReferenceRequest) =>
  await new Reference(payload).save()

const getReferenceById = async (id: string) => {
  const result = await Reference.findOne({ _id: id })
    .populate({
      path: 'graduateId lecturerId',
      select: 'firstName lastName email indexNumber referenceNumber',
      model: Users
    })
    .then((reference) => {
      if (reference) {
        return {
          id: reference._id,
          graduateInfo: reference.graduateId,
          lecturer: reference.lecturerId,
          programme: reference.programme,
          graduationYear: reference.graduationYear,
          requests: reference.requests,
          transactionStatus: reference.transactionStatus,
          createdAt: reference.createdAt,
          accepted: reference.accepted,
          status: reference.status
        }
      } else return new Error('Invalid reference id')
    })
  return result
}

const getUsersReferenceByRole = async (
  id: string,
  role: 'lecturer' | 'graduate'
) => {
  if (role === 'graduate') {
    const result = await Reference.find({ graduateId: id })
      .populate({
        path: 'graduateId lecturerId',
        select: 'indexNumber referenceNumber',
        model: Users
      })
      .sort({ createdAt: -1 })
      .then((reference) => {
        return reference.map((reference) => ({
          id: reference._id,
          graduateId: reference.graduateId,
          lecturerId: reference.lecturerId,
          programme: reference.programme,
          graduationYear: reference.graduationYear,
          requests: reference.requests,
          transactionStatus: reference.transactionStatus,
          createdAt: reference.createdAt,
          accepted: reference.accepted,
          status: reference.status
        }))
      })
    return result
  }

  const result = await Reference.find({ lecturerId: id })
    .populate({
      path: 'lecturerId graduateId',
      select: 'referenceNumber indexNumber',
      model: Users
    })
    .sort({ createdAt: -1 })
    .then((reference) => {
      return reference.map((reference) => ({
        id: reference._id,
        graduateId: reference.graduateId,
        lecturerId: reference.lecturerId,
        programme: reference.programme,
        graduationYear: reference.graduationYear,
        requests: reference.requests,
        createdAt: reference.createdAt,
        accepted: reference.accepted,
        transactionStatus: reference.transactionStatus,
        status: reference.status
      }))
    })
  return result
}

const updateReferenceById = async (
  id: Types.ObjectId,
  payload: Pick<IReferenceRequest, 'accepted'>
) => await Reference.findOneAndUpdate({ _id: id }, payload, { new: true })

export {
  RequestReference,
  getUsersReferenceByRole,
  updateReferenceById,
  getReferenceById
}
