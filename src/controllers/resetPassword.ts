import User from '../models/userModel'
import crypto from 'crypto'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, resetToken } = req.body

    if (!password || !resetToken)
      return res.status(400).json({ message: 'Invalid Request' })

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    })

    if (!user)
      return res.status(400).json({ message: 'Invalid Token or Expired' })

    // Hash password before saving to database
    const SALT_FACTOR = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, SALT_FACTOR)

    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()

    res.status(200).json({ message: 'Password Reset Successful' })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export { resetPassword }
