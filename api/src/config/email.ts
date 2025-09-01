import nodemailer from "nodemailer";

export const email = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, // Your SMTP server
    port: 465, // Use 465 for SSL or 587 for TLS
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // Your email address
      pass: process.env.SMTP_PASS, // Your email account password
    },
  });
};
