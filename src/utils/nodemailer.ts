import nodemailer from 'nodemailer'

const nodemailerTransporter = () => {
  const SMTP_transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  })

  return SMTP_transporter
}

export { nodemailerTransporter }
