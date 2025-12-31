import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ErrorHandler } from "../utils/ErrorHandler";
import { sendEmail } from "../utils/sendEmail";

type TEmailData = {
  recipientName: string;
  items: {
    companyName: string;
    name: string;
    expirationDate: string;
    daysRemaining: number;
  }[];
};

// send email and phisical notification every day of amc if any item expire date distance from current date distance is 1 month
export const checkAndSendNotificationOfAmc = asyncErrorHandler(
  async (req, res) => {
    if (req.query.key != process.env.CRON_RUNNER_KEY) {
      throw new ErrorHandler(401, "Unauthorize");
    }

    const { rowCount, rows } = await pool.query(
      `SELECT 
          product_name, 
          TO_CHAR(expiry_date, 'FMDD FMMonth, YYYY') AS expiry_date,
          company_name,
          expiry_date - CURRENT_DATE AS days_left
        FROM amc_list
        WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days';`
    );

    if (rowCount === 0) return res.send("No amc item to send notification");

    const emailData: TEmailData = {
      recipientName: "Global Technical Institute",
      items: [],
    };

    rows.forEach((item) => {
      emailData.items.push({
        name: item.product_name,
        companyName: item.company_name,
        daysRemaining: item.days_left,
        expirationDate: item.expiry_date,
      });
    });

    await sendEmail(process.env.AMC_ALERT_EMAIL ?? "", "AMC_ALERT", emailData);
  }
);
