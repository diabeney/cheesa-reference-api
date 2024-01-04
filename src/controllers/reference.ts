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
  req: Request<
    unknown,
    unknown,
    { quantity: number; data: Omit<IReferenceRequest, 'status'>[] }
  >,
  res: Response
) {
  /*  Retrieve the quantity and actual data 
      from the request body 
  */
  const { quantity, data } = req.body

  /*
  Validate the incoming data to check 
  if it's strictly an array or also check for the type of quantity 
  if it's strictly a number
*/
  if (!Array.isArray(data) || typeof quantity !== 'number') {
    return res
      .status(STATUS.BAD_REQUEST.code)
      .json(ErrorMsg(400, 'Expected an array of objects and a quantity'))
  }

  /*
  Here compares the length of the data to the value of quantity specified
  to ensure they match
*/
  if (data.length !== quantity) {
    return res
      .status(STATUS.BAD_REQUEST.code)
      .json(ErrorMsg(400, 'Quantity does not match the number of objects'))
  }

  // Array constructors to retrieve data
  const successfulSaves = []

  //Iterate through the array based on the quantity
  for (let i = 0; i < quantity; i++) {
    const referenceObject = data[i]
    const validatedObject = validateObject(referenceObject, ReferenceShape)

    if (validatedObject instanceof ZodError) {
      const { message } = validatedObject.issues[0]
      return res.status(400).json({ error: message })
    }

    try {
      const lecturer = await getLecturerById(validatedObject.lecturerId)
      console.log(lecturer)

      // Checking for the existence of the lecturer assigned
      if (!lecturer) {
        return res.status(404).json({ error: 'Lecturer not found' })
      }

      // Payloads to send to the database
      const payload = {
        ...validatedObject,
        expectedDate: new Date(validatedObject.expectedDate)
      }

      const _ = await RequestReference(payload)

      // Storing payloads into the array
      successfulSaves.push(payload)
    } catch (err) {
      console.log(err)
      res.status(500).json(ErrorMsg(500))
    }
  }

  res.status(201).json({
    message: `Successfully created ${successfulSaves.length} references`
  })
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
