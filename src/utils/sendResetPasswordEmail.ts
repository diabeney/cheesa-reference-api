import { Options } from '../types/types'
import { nodemailerTransporter } from './nodemailer'

const sendResetPasswordEmail = async (options: Options) => {
  const transporter = nodemailerTransporter()

  const message = {
    from: `REFHUB <${process.env.SMTP_USERNAME}>`,
    to: options.to,
    subject: options.subject,
    html: options.message
  }

  await transporter.sendMail(message)
}

export { sendResetPasswordEmail }
