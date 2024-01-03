import { CookieOptions, Request } from 'express'
import { TokenPayload } from '../utils'
import { Types } from 'mongoose'

export type TransactionStatus = 'pending' | 'paid'

export type Transaction = {
  id: string
  dateInitatiad: Date
  status: TransactionStatus
}
export type Programmes = 'petrochemical' | 'chemical'

export type IUser = Record<
  'firstName' | 'lastName' | 'email' | 'password' | 'role',
  string
>

export interface IReferenceRequest {
  id?: Types.ObjectId
  graduateId: Types.ObjectId
  lecturerId: Types.ObjectId
  programme: Programmes
  graduationYear: string
  referenceNumber: string
  indexNumber: string
  expectedDate: string | Date
  destination: string
  transactionStatus?: TransactionStatus
  status?: 'not ready' | 'submitted'
  accepted?: 'accepted' | 'declined' | 'null'
}

export interface AuthCookies extends CookieOptions {
  'Cheesa-Reference-JWT': string
}

export interface AuthRequest extends Request {
  userPayload?: TokenPayload
}

export type Options = {
  to: string
  subject: string
  message: string
}
