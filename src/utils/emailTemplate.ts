import { Types } from "mongoose";
import { IUser } from "../types/types";
import { format } from "date-fns";

type PaymentResponse = {
	paymentId: string;
	domain: string;
	gateway_response: string;
	newStatus: string;
	paid_at: Date;
	channel: string;
	amount: number;
};

type lecturer = {
	name: string;
};

type PaymentInfo = {
	name: string;
	email: string | undefined;
	graduateName?: string;
};

type MessagePayloads = {
	data: {
		graduateId: Types.ObjectId;
		lecturerId: Types.ObjectId;
		purposeOfReference: string;
		destination: string;
		expectedDate: Date;
	};
	programme: string;
	entryYear: string;
	graduationYear: string;
	fullName: string;
};

type MessageProps = {
	graduateName: string;
	lecturerName: string;
	destination: string;
};

type refDetails = {
	id: Types.ObjectId;
	name: string;
	destination: string;
	status: string;
	purposeOfReference?: string;
	programme: string;
	dueDate: string;
};

const forgotPasswordMessage = (resetUrl: string, user: IUser) => {
	const html = `
  <html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset your password</title>
  </head>

  <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
      <tbody>
        <tr>
          <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
            <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px;">
                    <div style="text-align: center; margin-bottom: 0.5rem;">
                      <div style="display: flex; align-items: center; justify-center; width: 100%; padding: 10px; background: white margin-bottom: ">
                        <img src="https://ik.imagekit.io/kkldhhslb/RefHub_logo_final.png?updatedAt=1704396221616" alt="Company-Logo" style="width:120px">
                      </div>
                    </div>
                    <div style="padding: 20px; background-color: rgb(255, 255, 255); border-radius: 0.5rem;">
                      <div style="color: rgb(46, 46, 46); text-align: left;">
                        <h3>Hello ${`${user.firstName} ${user.lastName}`},</h3>
                        <h1 style="margin: 1rem 0">Trouble signing in?</h1>
                        <p style="padding-bottom: 16px">We've received a request to reset the password for your account at RefHub. Kindly click on the button below to reset your password.</p>
                        <p style="padding-bottom: 16px">
                          <a href="${resetUrl}" target="_blank" style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block; margin: 0.5rem 0; text-decoration: none">Reset
                            your password</a>
                        </p>
                        <p style="padding-bottom: 16px">If you have any trouble clicking the button above, please copy and paste the URL below into your web browser.

                          <br>
                          <br>
                          <a href="${resetUrl}" target="_blank" style="color: #2B52F5; text-decoration: underline;">${resetUrl}</a>
                        </p>
                        </p>
                        <p style="padding-bottom: 16px">If you didn't ask to reset your password, you can ignore this email.</p>
                        <p style="padding-bottom: 16px">
                          <span>Thanks,</span>
                          <br>
                          <span style="font-weight: bold;">RefHub Support Team</span>
                        </p>
                      </div>
                    </div>
                    <div style="color: rgb(153, 153, 153); text-align: center; padding: 1rem;">
                      <p>
                       <span>&copy; ${new Date().getFullYear()} RefHub. All rights reserved.</span>
                       <br>
                        <span>A dedicated Platform to assist Graduates.</span>
                        <br>
                        <span> <a href="https://knust.edu.gh" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: inherit">KNUST</a>, Kumasi-Ghana</span>
                      </p>
                       <small style="padding-bottom: 16px;">
                         Proudly built by the engineers at 
                        <span style="font-weight: 700;">
                         <a href="#" target="_blank" rel="noopener noreferrer"  style="text-decoration: none; color: inherit">
                          InteliTech Inc.
                         </a>
                        </span>
                      </small>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>`;
	return html;
};

const EmailVerificationMessage = (verificationUrl: string, user: IUser) => {
	const html = `
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Email</title>
  </head>
  <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
      <tbody>
        <tr>
          <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
            <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px;">
                    <div style="text-align: center; margin-bottom: 0.5rem;">
                      <div style="display: flex; align-items: center; justify-center; width: 100%; padding: 10px; background: white margin-bottom: ">
                        <img src="https://ik.imagekit.io/kkldhhslb/RefHub_logo_final.png?updatedAt=1704396221616" alt="Company-Logo" style="width:120px">
                      </div>
                    </div>
                    <div style="padding: 20px; background-color: rgb(255, 255, 255); border-radius: 0.5rem;">
                      <div style="color: rgb(46, 46, 46); text-align: left;">
                        <h3>Hello ${`${user.firstName} ${user.lastName}`},</h3>
                        <h1 style="margin: 1rem 0">Verify your Email</h1>
                        <p style="padding-bottom: 16px">Please click on button below to verify your email address: </p>
                        <p style="padding-bottom: 16px">
                          <a href="${verificationUrl}" target="_blank" style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block; margin: 0.5rem 0; text-decoration: none">Verify your Email</a>
                        </p>
                        <p style="padding-bottom: 16px">Please ensure your email verification is successful.</p>
                        <p style="padding-bottom: 16px">
                          <span>Thanks,</span>
                          <br>
                          <span style="font-weight: bold;">RefHub Support Team</span>
                        </p>
                      </div>
                    </div>
                    <div style="color: rgb(153, 153, 153); text-align: center; padding: 1rem;">
                      <p>
                       <span>&copy; ${new Date().getFullYear()} RefHub. All rights reserved.</span>
                       <br>
                        <span>A dedicated Platform to assist Graduates.</span>
                        <br>
                        <span> <a href="https://knust.edu.gh" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: inherit">KNUST</a>, Kumasi-Ghana</span>
                      </p>
                       <small style="padding-bottom: 16px;">
                         Proudly built by the engineers at 
                        <span style="font-weight: 700;">
                         <a href="#" target="_blank" rel="noopener noreferrer"  style="text-decoration: none; color: inherit">
                          InteliTech Inc.
                         </a>
                        </span>
                      </small>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>`;
	return html;
};

const PaymentVerificationMessage = (
	paymentDetails: PaymentResponse,
	user: PaymentInfo,
) => {
	const html = `
  <html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment verification</title>
  </head>

  <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
      <tbody>
        <tr>
          <td align="center" style="padding: 1rem; vertical-align: top; width: 100%;">
            <table role="presentation" style="max-width:700px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px;">
                    <div style="text-align: center; margin-bottom: 0.5rem;">
                      <div style="display: flex; align-items: center; justify-center; width: 100%; padding: 10px; background: white margin-bottom: ">
                        <img src="https://ik.imagekit.io/kkldhhslb/RefHub_logo_final.png?updatedAt=1704396221616" alt="Company-Logo" style="width:120px">
                      </div>
                    </div>
                    <div style=" padding: 20px; background-color: rgb(255, 255, 255); border-radius: 0.5rem;">
                      <div style="color: rgb(46, 46, 46); text-align: left;">
                        <h1 style="margin: 1rem 0">Payment Verified!</h1>
                        <p>Hello ${user.name},</p>
                        <p style="padding-bottom: 16px">Your payment has successfully been verified, kindly go to your dashboard to monitor your request status.</p>
                        <strong style="padding-bottom: 16px">Here are the details of your payment:</strong>
                          <div style="padding-bottom: 16px; list-style: none;">
                              <p><strong>Payment Id:</strong> ${
																paymentDetails.paymentId
															}</p>
                              <p><strong>Payment Status:</strong> ${
																paymentDetails.gateway_response
															}</p>
                              <p><strong>Payment Amount:</strong> GHS ${
																paymentDetails.amount / 100
															}.00</p>
                              <p><strong>Payment Date:</strong> ${format(
																new Date(paymentDetails.paid_at),
																"dd/MM/yyyy",
															)}</p>
                              <p style="text-transform: capitalize"><strong>Payment Method:</strong> ${
																paymentDetails.channel
															}</p>
                          </div>
                          <p style="padding-bottom: 16px">
                          <a href="https://cheesa-reference-web.vercel.app/app/student/request" target="_blank" style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block; margin: 0.5rem 0; text-decoration: none">Go to Dashboard</a>
                        </p>
                         <p style="padding-bottom: 16px">If you have any questions or concerns, please don't hesitate to contact us.</p>
                        </p>
                        <p style="padding-bottom: 16px">
                          <span>Thanks,</span>
                          <br>
                          <span style="font-weight: bold;">RefHub Support Team</span>
                        </p>
                      </div>
                    </div>
                    <div style="color: rgb(153, 153, 153); text-align: center; padding: 1rem;">
                      <p>
                       <span>&copy; ${new Date().getFullYear()} RefHub. All rights reserved.</span>
                       <br>
                        <span>A dedicated Platform to assist Graduates.</span>
                        <br>
                        <span> <a href="https://knust.edu.gh" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: inherit">KNUST</a>, Kumasi-Ghana</span>
                      </p>
                       <small style="padding-bottom: 16px;">
                         Proudly built by the engineers at 
                        <span style="font-weight: 700;">
                         <a href="#" target="_blank" rel="noopener noreferrer"  style="text-decoration: none; color: inherit">
                          InteliTech Inc.
                         </a>
                        </span>
                      </small>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>`;
	return html;
};

const LecturerPaymentConfirmationMessage = (
	paymentDetails: PaymentResponse,
	data: PaymentInfo,
) => {
	const html = `
  <html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Confirmation</title>
  </head>

  <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
      <tbody>
        <tr>
          <td align="center" style="padding: 1rem; vertical-align: top; width: 100%;">
            <table role="presentation" style="max-width: 700px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px;">
                    <div style="text-align: center; margin-bottom: 0.5rem;">
                      <div style="display: flex; align-items: center; justify-center; width: 100%; padding: 10px; background: white margin-bottom: ">
                        <img src="https://ik.imagekit.io/kkldhhslb/RefHub_logo_final.png?updatedAt=1704396221616" alt="Company-Logo" style="width:120px">
                      </div>
                    </div>
                    <div style=" padding: 20px; background-color: rgb(255, 255, 255); border-radius: 0.5rem;">
                      <div style="color: rgb(46, 46, 46); text-align: left;">
                      <h1 style="margin: 1rem 0">Payment Confirmed!</h1>
                        <p>Hello ${data.name},</p>
                        <p style="padding-bottom: 16px">A payment has been made by <strong>${
													data.graduateName
												}</strong> for a recommendation letter after being notified that the request has been <strong>ACCEPTED</strong></p>
                        <strong style="padding-bottom: 16px">Here are the details of the transaction:</strong>
                          <div style="padding-bottom: 16px; list-style: none;">
                              <p><strong>Payment Id:</strong> ${
																paymentDetails.paymentId
															}</p>
                              <p><strong>Payment Status:</strong> ${
																paymentDetails.gateway_response
															}</p>
                              <p><strong>Payment Amount:</strong> GHS ${
																paymentDetails.amount / 100
															}.00</p>
                              <p><strong>Payment Date:</strong> ${format(
																new Date(paymentDetails.paid_at),
																"dd/MM/yyyy",
															)}</p>
                              <p style="text-transform: capitalize"><strong>Payment Method:</strong> ${
																paymentDetails.channel
															}</p>
                          </div>
                          <p style="padding-bottom: 16px">
                          <a href="https://cheesa-reference-web.vercel.app/app/lecturer/request" target="_blank" style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block; margin: 0.5rem 0; text-decoration: none">Go to Dashboard</a>
                        </p>
                         <p style="padding-bottom: 16px">If you have any questions or concerns, please don't hesitate to contact us.</p>
                        </p>
                        <p style="padding-bottom: 16px">
                          <span>Thanks,</span>
                          <br>
                          <span style="font-weight: bold;">RefHub Support Team</span>
                        </p>
                      </div>
                    </div>
                    <div style="color: rgb(153, 153, 153); text-align: center; padding: 1rem;">
                      <p>
                       <span>&copy; ${new Date().getFullYear()} RefHub. All rights reserved.</span>
                       <br>
                        <span>A dedicated Platform to assist Graduates.</span>
                        <br>
                        <span> <a href="https://knust.edu.gh" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: inherit">KNUST</a>, Kumasi-Ghana</span>
                      </p>
                       <small style="padding-bottom: 16px;">
                         Proudly built by the engineers at 
                        <span style="font-weight: 700;">
                         <a href="#" target="_blank" rel="noopener noreferrer"  style="text-decoration: none; color: inherit">
                          InteliTech Inc.
                         </a>
                        </span>
                      </small>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>`;
	return html;
};

const isAcceptedMessage = (payloads: MessageProps) => {
	const html = `
  <html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceptance Notice</title>
  </head>

  <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
      <tbody>
        <tr>
          <td align="center" style="padding: 1rem; vertical-align: top; width: 100%;">
            <table role="presentation" style="max-width:700px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px;">
                    <div style="text-align: center; margin-bottom: 0.5rem;">
                      <div style="display: flex; align-items: center; justify-center; width: 100%; padding: 10px; background: white margin-bottom: ">
                        <img src="https://ik.imagekit.io/kkldhhslb/RefHub_logo_final.png?updatedAt=1704396221616" alt="Company-Logo" style="width:120px">
                      </div>
                    </div>
                    <div style=" padding: 20px; background-color: rgb(255, 255, 255); border-radius: 0.5rem;">
                      <div style="color: rgb(46, 46, 46); text-align: left;">
                        <h1 style="margin: 1rem 0">Request Acceptance Notice</h1>
                        <h3>Hello ${payloads.graduateName},</h3>
                        <p style="padding-bottom: 16px;">The request you made for a recommendation letter to be sent to <strong style="text-transform: capitalize;">${
													payloads.destination
												}</strong> has been <strong>ACCEPTED</strong> by your assigned lecturer, <strong>${
													payloads.lecturerName
												}</strong>, so kindly visit your dashboard to make payment.</p>
                        <p style="padding-bottom: 16px">
                          <a href="https://cheesa-reference-web.vercel.app/app/student/request" target="_blank" style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block; margin: 0.5rem 0; text-decoration: none">Go to Dashboard</a>
                        </p>
                         <p style="padding-bottom: 16px">If you have any questions or concerns, please don't hesitate to contact us.</p>
                        </p>
                        <p style="padding-bottom: 16px">
                          <span>Thanks,</span>
                          <br>
                          <span style="font-weight: bold;">RefHub Support Team</span>
                        </p>
                      </div>
                    </div>
                    <div style="color: rgb(153, 153, 153); text-align: center; padding: 1rem;">
                      <p>
                       <span>&copy; ${new Date().getFullYear()} RefHub. All rights reserved.</span>
                       <br>
                        <span>A dedicated Platform to assist Graduates.</span>
                        <br>
                        <span> <a href="https://knust.edu.gh" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: inherit">KNUST</a>, Kumasi-Ghana</span>
                      </p>
                       <small style="padding-bottom: 16px;">
                         Proudly built by the engineers at 
                        <span style="font-weight: 700;">
                         <a href="#" target="_blank" rel="noopener noreferrer"  style="text-decoration: none; color: inherit">
                          InteliTech Inc.
                         </a>
                        </span>
                      </small>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
  `;
	return html;
};

const isRejectedMessage = (payloads: MessageProps) => {
	const html = `
    <html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Declination Notice</title>
  </head>

  <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
      <tbody>
        <tr>
          <td align="center" style="padding: 1rem; vertical-align: top; width: 100%;">
            <table role="presentation" style="max-width:700px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px;">
                    <div style="text-align: center; margin-bottom: 0.5rem;">
                      <div style="display: flex; align-items: center; justify-center; width: 100%; padding: 10px; background: white margin-bottom: ">
                        <img src="https://ik.imagekit.io/kkldhhslb/RefHub_logo_final.png?updatedAt=1704396221616" alt="Company-Logo" style="width:120px">
                      </div>
                    </div>
                    <div style=" padding: 20px; background-color: rgb(255, 255, 255); border-radius: 0.5rem;">
                      <div style="color: rgb(46, 46, 46); text-align: left;">
                        <h1 style="margin: 1rem 0">Request Decline Notice</h1>
                        <h3>Hello ${payloads.graduateName},</h3>
                        <p style="padding-bottom: 16px">Sorry!😢 The request you made for a recommendation letter to be sent to <strong style="text-transform: capitalize;">${
													payloads.destination
												}</strong> has been <strong>DECLINED</strong> by the assigned lecturer, <strong>${
													payloads.lecturerName
												}</strong>.</p>
    
                        <p style="padding-bottom: 16px">
                          <a href="https://cheesa-reference-web.vercel.app/app/student/request" target="_blank" style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block; margin: 0.5rem 0; text-decoration: none">Go to Dashboard</a>
                        </p>
                         <p style="padding-bottom: 16px">If you have any questions or concerns, please don't hesitate to contact us.</p>
                        </p>
                        <p style="padding-bottom: 16px">
                          <span>Best Regards,</span>
                          <br>
                          <span style="font-weight: bold;">RefHub Support Team</span>
                        </p>
                      </div>
                    </div>
                    <div style="color: rgb(153, 153, 153); text-align: center; padding: 1rem;">
                      <p>
                       <span>&copy; ${new Date().getFullYear()} RefHub. All rights reserved.</span>
                       <br>
                        <span>A dedicated Platform to assist Graduates.</span>
                        <br>
                        <span> <a href="https://knust.edu.gh" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: inherit">KNUST</a>, Kumasi-Ghana</span>
                      </p>
                       <small style="padding-bottom: 16px;">
                         Proudly built by the engineers at 
                        <span style="font-weight: 700;">
                         <a href="#" target="_blank" rel="noopener noreferrer"  style="text-decoration: none; color: inherit">
                          InteliTech Inc.
                         </a>
                        </span>
                      </small>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
   `;
	return html;
};

const isSubmittedMessage = (payloads: MessageProps) => {
	const html = `
    <html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submission Notice</title>
  </head>

  <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
      <tbody>
        <tr>
          <td align="center" style="padding: 1rem; vertical-align: top; width: 100%;">
            <table role="presentation" style="max-width:700px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px;">
                    <div style="text-align: center; margin-bottom: 0.5rem;">
                      <div style="display: flex; align-items: center; justify-center; width: 100%; padding: 10px; background: white margin-bottom: ">
                        <img src="https://ik.imagekit.io/kkldhhslb/RefHub_logo_final.png?updatedAt=1704396221616" alt="Company-Logo" style="width:120px">
                      </div>
                    </div>
                    <div style=" padding: 20px; background-color: rgb(255, 255, 255); border-radius: 0.5rem;">
                      <div style="color: rgb(46, 46, 46); text-align: left;">
                        <h1 style="margin: 1rem 0">Request Submission Notice</h1>
                        <h3>Hello ${payloads.graduateName},</h3>
                        <p style="padding-bottom: 16px">Congratulations🎊</p>
                        <p style="padding-bottom: 16px"><strong>${
													payloads.lecturerName
												}</strong> has successfully submitted your recommendation letter to <strong style="text-transform: capitalize;">${
													payloads.destination
												}</strong>.</p>
                          <p style="padding-bottom: 16px">
                          <a href="https://cheesa-reference-web.vercel.app/app/student/request" target="_blank" style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block; margin: 0.5rem 0; text-decoration: none">Go to Dashboard</a>
                        </p>
                         <p style="padding-bottom: 16px"> We wish you the best of luck in your future endeavors!</p>
                        </p>
                        <p style="padding-bottom: 16px">
                          <span>Best Regards,</span>
                          <br>
                          <span style="font-weight: bold;">RefHub Support Team</span>
                        </p>
                      </div>
                    </div>
                    <div style="color: rgb(153, 153, 153); text-align: center; padding: 1rem;">
                      <p>
                       <span>&copy; ${new Date().getFullYear()} RefHub. All rights reserved.</span>
                       <br>
                        <span>A dedicated Platform to assist Graduates.</span>
                        <br>
                        <span> <a href="https://knust.edu.gh" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: inherit">KNUST</a>, Kumasi-Ghana</span>
                      </p>
                       <small style="padding-bottom: 16px;">
                         Proudly built by the engineers at 
                        <span style="font-weight: 700;">
                         <a href="#" target="_blank" rel="noopener noreferrer"  style="text-decoration: none; color: inherit">
                          InteliTech Inc.
                         </a>
                        </span>
                      </small>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
  `;
	return html;
};

const requestReferenceMessage = (lecturer: IUser, payload: MessagePayloads) => {
	const html = `
  <html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Notice</title>
  </head>

  <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
      <tbody>
        <tr>
          <td align="center" style="padding: 1rem; vertical-align: top; width: 100%;">
            <table role="presentation" style="max-width:700px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px;">
                    <div style="text-align: center; margin-bottom: 0.5rem;">
                      <div style="display: flex; align-items: center; justify-center; width: 100%; padding: 10px; background: white margin-bottom: ">
                        <img src="https://ik.imagekit.io/kkldhhslb/RefHub_logo_final.png?updatedAt=1704396221616" alt="Company-Logo" style="width:120px">
                      </div>
                    </div>
                    <div style=" padding: 20px; background-color: rgb(255, 255, 255); border-radius: 0.5rem;">
                      <div style="color: rgb(46, 46, 46); text-align: left;">
                        <h1 style="margin: 1rem 0">Request Notice</h1>
                        <p>Dear ${lecturer.firstName} ${lecturer.lastName},</p>
                        <p style="padding-bottom: 16px"><strong>${
													payload.fullName
												}</strong> has submitted a reference letter request for their application.<br /><br/> Find below the details of the request:</p>
                         <p style="text-transform: capitalize;">Entry Year: <strong >${
														payload.entryYear
													}</strong></p>
                          <p style="text-transform: capitalize;">Graduation Year: <strong >${
														payload.graduationYear
													}</strong></p>
                          <p style="text-transform: capitalize;">Selected Institution: <strong >${
														payload.data.destination
													}</strong></p>
                          <p style="text-transform: capitalize;">Programme: <strong >${
														payload.programme
													}</strong></p>
                          <p style="text-transform: capitalize;">Purpose of Reference: <strong >${
														payload.data.purposeOfReference
													}</strong></p>
                          <p>Expected Date: <strong>${format(
														payload.data.expectedDate,
														"dd/MM/yyyy",
													)}</strong></p>
                        <p style="padding-bottom: 16px"> Please log in to your dashboard to review the request.</p>
                        <p style="padding-bottom: 16px">
                          <a href="https://cheesa-reference-web.vercel.app/app/lecturer/request" target="_blank" style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block; margin: 0.5rem 0; text-decoration: none">Go to Dashboard</a>
                        </p>
                        <p style="padding-bottom: 16px">Thank you for your time and consideration.</p>
                        </p>
                        <p style="padding-bottom: 16px">
                          <span>Sincerely,</span>
                          <br>
                          <span style="font-weight: bold;">RefHub Support Team</span>
                        </p>
                      </div>
                    </div>
                    <div style="color: rgb(153, 153, 153); text-align: center; padding: 1rem;">
                      <p>
                       <span>&copy; ${new Date().getFullYear()} RefHub. All rights reserved.</span>
                       <br>
                        <span>A dedicated Platform to assist Graduates.</span>
                        <br>
                        <span> <a href="https://knust.edu.gh" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: inherit">KNUST</a>, Kumasi-Ghana</span>
                      </p>
                       <small style="padding-bottom: 16px;">
                         Proudly built by the engineers at 
                        <span style="font-weight: 700;">
                         <a href="#" target="_blank" rel="noopener noreferrer"  style="text-decoration: none; color: inherit">
                          InteliTech Inc.
                         </a>
                        </span>
                      </small>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
  `;
	return html;
};

const requestReminderMessage = (
	referenceDetails: refDetails,
	lectuerInfo: lecturer,
) => {
	const html = `
    <html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request Reminder</title>
  </head>

  <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
      <tbody>
        <tr>
          <td align="center" style="padding: 1rem; vertical-align: top; width: 100%;">
            <table role="presentation" style="max-width:700px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
              <tbody>
                <tr>
                  <td style="padding: 40px 0px 0px;">
                    <div style="text-align: center; margin-bottom: 0.5rem;">
                      <div style="display: flex; align-items: center; justify-center; width: 100%; padding: 10px; background: white margin-bottom: ">
                        <img src="https://ik.imagekit.io/kkldhhslb/RefHub_logo_final.png?updatedAt=1704396221616" alt="Company-Logo" style="width:120px">
                      </div>
                    </div>
                    <div style=" padding: 20px; background-color: rgb(255, 255, 255); border-radius: 0.5rem;">
                      <div style="color: rgb(46, 46, 46); text-align: left;">
                        <h1 style="margin: 1rem 0">Request Reminder</h1>
                        <p>Dear ${lectuerInfo.name} </p>
                        <p style="padding-bottom: 16px">This is a reminder that you have been requested to submit a reference for <strong>${
													referenceDetails.name
												}</strong>.</p>
                        <strong style="padding-bottom: 16px">Please find below some details regarding the request:</strong>
                          <div style="padding-bottom: 16px; list-style: none;">
                              <p><strong>Reference Id:</strong> ${
																referenceDetails.id
															}</p>
                              <p style="text-transform: capitalize"><strong>Programme:</strong> ${
																referenceDetails.programme
															} Engineering</p>
                              <p style="text-transform: capitalize"><strong>Reference Status:</strong> ${
																referenceDetails.status
															}</p>
                                <p style="text-transform: capitalize"><strong>Purpose of Reference:</strong> ${
																	referenceDetails.purposeOfReference
																}</p>
                              <p><strong>Destination:</strong> ${
																referenceDetails.destination
															}</p>
                              <p><strong>Due Date:</strong> ${format(
																referenceDetails.dueDate,
																"PPPP",
															)}</p>
                          </div>
                           <p style="padding-bottom: 16px">
                          <a href="https://cheesa-reference-web.vercel.app/app/lecturer/request" target="_blank" style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block; margin: 0.5rem 0; text-decoration: none">Go to Dashboard</a>
                        </p>
                         <p style="padding-bottom: 16px">Please log in to your dashboard to submit the reference.</p>
                        </p>
                        <p style="padding-bottom: 16px">
                          <span>Thanks,</span>
                          <br>
                          <span style="font-weight: bold;">RefHub Support Team</span>
                        </p>
                      </div>
                    </div>
                    <div style="color: rgb(153, 153, 153); text-align: center; padding: 1rem;">
                      <p>
                       <span>&copy; ${new Date().getFullYear()} RefHub. All rights reserved.</span>
                       <br>
                        <span>A dedicated Platform to assist Graduates.</span>
                        <br>
                        <span> <a href="https://knust.edu.gh" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: inherit">KNUST</a>, Kumasi-Ghana</span>
                      </p>
                       <small style="padding-bottom: 16px;">
                         Proudly built by the engineers at 
                        <span style="font-weight: 700;">
                         <a href="#" target="_blank" rel="noopener noreferrer"  style="text-decoration: none; color: inherit">
                          InteliTech Inc.
                         </a>
                        </span>
                      </small>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
  `;
	return html;
};

export {
	forgotPasswordMessage,
	EmailVerificationMessage,
	PaymentVerificationMessage,
	LecturerPaymentConfirmationMessage,
	isAcceptedMessage,
	isRejectedMessage,
	isSubmittedMessage,
	requestReferenceMessage,
	requestReminderMessage,
};
