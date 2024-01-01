import nodemailer from 'nodemailer'
import { Options } from '../types/types'

export const sendEmail = async (options: Options) => {
  const SMTP_transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  })

  const message = {
    from: `REFHUB <${process.env.SMTP_USERNAME}>`,
    to: options.to,
    subject: options.subject,
    text: options.message
  }

  return await SMTP_transporter.sendMail(message)
}
