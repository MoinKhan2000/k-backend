import '../config/dotenv.config.js'
import nodemailer from "nodemailer";
import ApplicationErrorHandler from "./errorHandler.js";

const sendPasswordResetEmail = async (user, resetPasswordURL) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  console.log(process.env.SMTP_SERVICE);
  console.log(process.env.EMAIL_USER);


  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset",
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>We received a request to reset your password for your account. Click the button below to reset it:</p>
          <a href="${resetPasswordURL}" style="display: inline-block; padding: 10px 20px; background-color: #20d49a; color: #fff; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p><strong>This window is open for 10 minutes only!</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Thank you!</p>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending password reset email to ${user.email}:`, error);
    throw new ApplicationErrorHandler(`Error sending password reset email to ${user.email}`, 500);
  }
};
export default sendPasswordResetEmail