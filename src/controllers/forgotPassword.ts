import User from '../models/userModel'
import { sendEmail } from '../utils/nodemailer'
import { forgotMessage } from '../utils/emailTemplate'
import { Request, Response } from 'express'

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body

    if (!email)
      return res.status(400).json({ message: 'Please enter your valid email' })

    const user = await User.findOne({ email })

    if (!user) return res.status(400).json({ message: 'Email does not exist' })

    const resetToken = user.getResetPasswordToken()

    await user.save()

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    const message = forgotMessage(resetUrl, user)

    const dispatchedMessage = sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      message: message.html
    })

    if (!dispatchedMessage)
      return res.status(500).json({ message: 'Could not send email' })

    await dispatchedMessage

    res.status(200).json({
      message: `Reset link sent successfully to ${email} with further instructions`
    })
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export { forgotPassword }
