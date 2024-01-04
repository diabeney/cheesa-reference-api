import { IUser } from '../types/types'

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
                        <img src="https://ik.imagekit.io/kkldhhslb/refhub_edited__VgDfBku_?updatedAt=1704156192825" alt="Company" style="width:120px">
                      </div>
                    </div>
                    <div style="padding: 20px; background-color: rgb(255, 255, 255); border-radius: 0.5rem;">
                      <div style="color: rgb(46, 46, 46); text-align: left;">
                        <h3>Hello ${user.firstName + ' ' + user.lastName},</h3>
                        <h1 style="margin: 1rem 0">Trouble signing in?</h1>
                        <p style="padding-bottom: 16px">We've received a request to reset the password for this user account.</p>
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

</html>`
  return html
}

export { forgotPasswordMessage }
