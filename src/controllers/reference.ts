import { Request, Response } from 'express'
import { IReferenceRequest } from '../types/types'
import { validateObject, ErrorMsg, STATUS, TokenPayload } from '../utils'
import { ReferenceShape, RespondToReference } from '../constants/constants'
import { ZodError } from 'zod'
import { Types } from 'mongoose'
import { getLecturerById } from '../db/user'
import {
  getUsersReferenceByRole,
  getReferenceById,
  RequestReference,
  updateReferenceById
} from '../db/reference'

type QueryFields = {
  refId: Types.ObjectId
  accepted: string
}

interface AuthQueryRequest
  extends Request<unknown, unknown, unknown, QueryFields> {
  userPayload?: TokenPayload
}

async function handleRequestReference(
  req: Request<unknown, unknown, Omit<IReferenceRequest, 'status'>>,
  res: Response
) {
  //  validate the reference
  const referenceObject = ReferenceShape.parse(req.body)

  const {
    quantity,
    lecturerId,
    graduateId,
    programme,
    graduationYear,
    requests
  } = referenceObject

  if (referenceObject instanceof ZodError) {
    const { message } = referenceObject.issues[0]
    return res.status(STATUS.BAD_REQUEST.code).json(ErrorMsg(400, message))
  }

  try {
    const lecturer = await getLecturerById(referenceObject.lecturerId)

    if (!lecturer) return res.status(STATUS.NOT_FOUND.code).json(ErrorMsg(404))

    // Create a reference for each request
    for (let i = 0; i < quantity; i++) {
      const request = requests[i]
      if (!request) {
        return res
          .status(400)
          .json({ error: `Request ${i + 1} not found in the payload` })
      }

      const { destination, expectedDate } = request

      const payload = {
        graduateId,
        lecturerId,
        programme,
        graduationYear,
        requests: [
          {
            destination,
            expectedDate: new Date(expectedDate)
          }
        ]
      } as Omit<IReferenceRequest, 'status'>

      const _ = await RequestReference(payload)
    }
    res.status(201).json({ message: 'Successfully created reference' })
  } catch (err) {
    console.log(err)
    res.status(500).json(ErrorMsg(500))
  }
}

async function handleViewReference(req: Request, res: Response) {
  const id = req.params.id

  if (!id) return res.status(400).json(ErrorMsg(400))

  try {
    const reference = await getReferenceById(id)

    if (reference instanceof Error) return res.status(404).json(ErrorMsg(404))
    res.status(200).json({ ...reference })
  } catch (err) {
    console.log(err)
    res.status(500).json(ErrorMsg(500))
  }
}

const GraduatesReferenceControllers = {
  handleGetGradReferences: async (req: Request, res: Response) => {
    const id = req.params.id

    if (!id) return res.status(400).json(ErrorMsg(400))

    try {
      const references = await getUsersReferenceByRole(id, 'graduate')
      res.status(200).json({ results: references })
    } catch (err) {
      console.log(err)
      res.status(500).json(ErrorMsg(500))
    }
  }
}

const LecturersReferenceControllers = {
  handleGetLecturerReferences: async (req: Request, res: Response) => {
    const id = req.params.id

    if (!id) return res.status(400).json(ErrorMsg(400))

    try {
      const references = await getUsersReferenceByRole(id, 'lecturer')
      res.status(200).json({ results: references })
    } catch (err) {
      console.log(err)
      res.status(500).json(ErrorMsg(500))
    }
  },

  handleRespondRequest: async (req: AuthQueryRequest, res: Response) => {
    const lecturerObj = req.userPayload
    if (!lecturerObj) return res.status(401).json(ErrorMsg(401))

    const queryParams = req.query
    if (!queryParams) return res.status(400).json(ErrorMsg(400))

    const validatedParams = validateObject(queryParams, RespondToReference)

    if (validatedParams instanceof ZodError) {
      const { message } = validatedParams.issues[0]
      return res.status(STATUS.BAD_REQUEST.code).json(ErrorMsg(400, message))
    }

    try {
      const { id } = lecturerObj

      const lecturer = await getLecturerById(id)

      if (!lecturer.length) return res.status(403).json(ErrorMsg(403))

      const { refId, accepted: isAccepted } = validatedParams

      const updatePayload = {
        accepted: isAccepted === 'true' ? 'accepted' : 'declined'
      } as { accepted: 'accepted' | 'declined' }

      const _ = await updateReferenceById(refId, updatePayload)

      res.status(200).json({ message: 'Successful' })
    } catch (err) {
      console.log(err)
      res.status(500).json(ErrorMsg(500))
    }
  }
}

export { handleRequestReference, handleViewReference }
export { LecturersReferenceControllers as handleLecturers }
export { GraduatesReferenceControllers as handleGraduates }
