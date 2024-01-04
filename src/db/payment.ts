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

      /*  Checking the length of the payments tank
          to return a reasonable reponse
      */
      if (payments.length <= 0) {
        return res.status(404).json(ErrorMsg(404, 'There are no payments yet!'))
      }

      return res.status(200).json(payments)
    } catch (error) {
      console.error(error)
      return res.status(500).json(ErrorMsg(500))
    }
  }
}

export const { getPaymentsByUserId } = PaystackPayments
