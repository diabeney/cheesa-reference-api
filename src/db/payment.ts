import { Request, Response } from 'express'
import Payments from '../models/paymentModel'
import Users from '../models/userModel'
import { ErrorMsg } from '../utils'

const PaystackPayments = {
  // Get all Payments by specific user by id
  getPaymentsByUserId: async (req: Request, res: Response) => {
    const { userId } = req.params

    if (!userId) return res.status(400).json(ErrorMsg(400))

    try {
      const payments = await Payments.find({ userId }).populate({
        path: 'userId',
        select: 'firstName, lastName, email',
        model: Users
      })

      return res.status(200).json(payments)
    } catch (error) {
      console.error(error)
      return res.status(500).json(ErrorMsg(500))
    }
  }
}

export const { getPaymentsByUserId } = PaystackPayments
