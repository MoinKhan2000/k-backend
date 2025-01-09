import '../config/dotenv.config.js'
import nodemailer from "nodemailer";
import ApplicationErrorHandler from "./errorHandler.js";
const projectName = process.env.PROJECT_NAME;

export const sendWelcomeEmail = async (user) => {
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
    subject: `Welcome to ${projectName}!`,
    html: `
      <html>
        <body>
          <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>Welcome to ${projectName}, ${user.name}!</h2>
            <p>We're thrilled to have you on board. Get ready to explore and enjoy everything ${projectName} has to offer!</p>
            <p>If you have any questions, feel free to reach out.</p>
            <p>Best regards,<br/>The ${projectName} Team</p>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending welcome email to ${user.email}:`, error);
    // throw error;
    throw new ApplicationErrorHandler(`Error sending welcome mail email to ${user.email}`, 500);
  }
};
