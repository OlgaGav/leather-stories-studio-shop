import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

try {
  await transporter.verify();
  console.log("✓ SMTP connection OK");

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "ogavby@gmail.com",
    subject: "Test email from Leather Stories Studio",
    text: "If you received this, the Hostinger SMTP config is working correctly.",
  });

  console.log("✓ Email sent:", info.messageId);
} catch (err) {
  console.error("✗ Error:", err.message);
  process.exit(1);
}
