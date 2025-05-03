import nodemailer from "nodemailer";

async function sendResetEmail(email, token) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: `"No Reply" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Password Reset",
    html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetUrl}">here</a> to reset your password.</p>
        <p>This link will expire in 1 hour.</p>
      `,
  };
  console.log("RESET LINK:", resetUrl); // delete it after we finish app (needs for check a token)

  try {
    await transporter.sendMail(message);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export { sendResetEmail };
