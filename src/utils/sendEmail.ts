import { Options } from "../types/types";
import { nodemailerTransporter } from "./nodemailer";

const submitRequestEmail = async (options: Options) => {
  const transporter = nodemailerTransporter();

  const message = {
    from: `REFHUB MAIL <${process.env.SMTP_USERNAME}>`,
    to: options.to,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(message);
};

export { submitRequestEmail };
