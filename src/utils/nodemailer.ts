import nodemailer from 'nodemailer'
import { Options } from '../types/types'

export const sendEmail = async (options: Options) => {
  const SMTP_transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  })

  const message = {
    from: `REFHUB <${process.env.SMTP_USERNAME}>`,
    to: options.to,
    subject: options.subject,
    html: options.message
  }

  return await SMTP_transporter.sendMail(message)
}
