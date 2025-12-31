import SMTPTransport from "nodemailer/lib/smtp-transport";
import { generateEmailTemplate } from "./generateEmailTemplate";
import { email } from "../config/email";

export type EmailType = "AMC_ALERT" | "ENQUIRY_EMAIL";

export const sendEmail = async (
  to: string[] | string,
  type: EmailType,
  templateData?: ejs.Data
) => {
  const sendForm = process.env.EMAIL_SENDER_EMAIL;

  let mailOptions = {};

  if (type === "AMC_ALERT") {
    const html = await generateEmailTemplate(
      templateData ?? {},
      "amc-notification.html"
    );
    mailOptions = {
      from: `"AMC Alert Notification From CRM" <${sendForm}>`, // Sender address
      to, // List of recipients
      subject: "AMC Alert Notification From CRM", // Subject line
      html,
    };
  } else if (type === "ENQUIRY_EMAIL") {
    const html = await generateEmailTemplate(
      templateData ?? {},
      "enquiry.html"
    );
    mailOptions = {
      from: `"Enquiry Notification From Website" <${sendForm}>`, // Sender address
      to, // List of recipients
      subject: "Enquiry Notification From Website", // Subject line
      html,
    };
  }

  return new Promise(
    (resolve: (value: SMTPTransport.SentMessageInfo) => void, reject) => {
      email().sendMail(mailOptions, (error, info) => {
        if (error) {
          reject("Error sending email:" + error);
        }
        resolve(info);
      });
    }
  );
};
