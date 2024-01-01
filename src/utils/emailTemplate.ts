import { IUser } from '../types/types'

const forgotMessage = (resetUrl: string, user: IUser) => {
  const html = `
   <body
  style="
  color: rgb(68,68,68);
  font-family: 'Sergoe UI', Tahoma, Geneva, Verdana, sans-serif;
  "
  >
  <div style="padding: 1rem; background-color: #fff; height: 25rem; width: 100% display: flex; flex-direction: column; align-items: start;">
      <h2 class="title" style="text-align: center">Reset Your Password</h2>
  <h4>Hello ${user.firstName + '' + user.lastName},</h4>
  <p>
    Tap the link below reset your <span style="font-style: italic; font-weight: bold;">REFHUB</span> account password. If you didn't request to reset your password, you can safely delete this email: 
    <br/>
    <br/>
    <a class="reset-btn"
        style="
         
          font-weight: 900;
          text-decoration: underline;
          text-transform: uppercase;
          "
          target="_blank"
          href="${resetUrl}"
          >
          Reset Password
      </a>
      </p>

      <p>
        If that doen't work, copy and paste the following link in your browser:
      </p>
      <div class='text-link'>
        <a target="_blank" href="${resetUrl}"> ${resetUrl} </a>
      </div>
      <p style="
        font-size: 16px;">
        <span>Thank you, </span> <br/>
        <span style="font-weight: bold;"> RefHub Support Team &bull; </span>
      </p>
  </div>
  </body>
  `
  return html
}

export { forgotMessage }
