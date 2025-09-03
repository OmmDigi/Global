import cron from "node-cron";
import { pool } from "../config/db";
import { TEmailData } from "../types";
import { sendEmail } from "../utils/sendEmail";

export const runAmcAlertChecking = () => {
  cron.schedule(
    // "0 0 * * *",
    // "*/5 * * * * *",
    "30 0 * * *", //every day 12:30
    async () => {
      try {
        // console.log("RUNNING JOB")
        const { rowCount, rows } = await pool.query(
          `SELECT 
            product_name, 
            TO_CHAR(renewal_date, 'FMDD FMMonth, YYYY') AS renewal_date,
            company_name,
            renewal_date - CURRENT_DATE AS days_left
          FROM amc_list
          WHERE renewal_date BETWEEN CURRENT_DATE - INTERVAL '5 days' AND CURRENT_DATE + INTERVAL '30 days';`
        );

        if (rowCount === 0) {
          return;
        }

        const emailData: TEmailData = {
          recipientName: "Global Technical Institute",
          items: [],
        };

        rows.forEach((item) => {
          emailData.items.push({
            name: item.product_name,
            companyName: item.company_name,
            daysRemaining: item.days_left,
            renewalDate: item.renewal_date,
          });
        });

        await sendEmail(
          process.env.AMC_ALERT_EMAIL ?? "",
          "AMC_ALERT",
          emailData
        );

      } catch {}
    },
    {
      timezone: "Asia/Kolkata",
    }
  );
};