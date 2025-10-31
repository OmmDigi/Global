import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import {
  VMonthlyIncome,
  VPerDayAttendance,
  VYearlyAdmission,
} from "../validator/dashboard.validator";

export const getYearlyAdmission = asyncErrorHandler(async (req, res) => {
  const { error, value } = VYearlyAdmission.validate(req.query);
  if (error) throw new ErrorHandler(400, error.message);

  // calclute the yearly admission
  let currentYear: string | null = null;
  if (value.year) {
    currentYear = value.year.toString();
  } else {
    currentYear = new Date().getFullYear().toString();
  }

  if (!currentYear) throw new ErrorHandler(400, "Year is required");

  const { rows } = await pool.query(
    `
     WITH months AS (
        SELECT generate_series(1, 12) AS month_num
    )
    SELECT
        TO_CHAR(TO_DATE(m.month_num::text, 'MM'), 'Mon') AS month,
        COALESCE(f.admission, 0) AS admission
    FROM months m
    LEFT JOIN (
        SELECT
            EXTRACT(MONTH FROM created_at) AS month_num,
            COUNT(*) AS admission
        FROM fillup_forms
        WHERE status = 2
        AND EXTRACT(YEAR FROM created_at) = $1
        GROUP BY EXTRACT(MONTH FROM created_at)
    ) f ON m.month_num = f.month_num
    ORDER BY m.month_num;
    `,
    [currentYear]
  );

  res.status(200).json(new ApiResponse(200, "Dashboard", rows));
});

export const getMonthlyIncome = asyncErrorHandler(async (req, res) => {
  //get monthly income
  const { error, value } = VMonthlyIncome.validate(req.query);
  if (error) throw new ErrorHandler(400, error.message);

  let from_date = "";
  let to_date = "";
  if (value.from_date && value.to_date) {
    from_date = value.from_date;
    to_date = value.to_date;
  } else {
    const date = new Date();
    from_date = `${date.getFullYear()}-${date.getMonth() + 1}-01`;
    to_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  const { rows } = await pool.query(
    `
        WITH modes AS (
            SELECT unnest(ARRAY['Cash', 'Online', 'Cheque']) AS mode
        )
        SELECT
            m.mode,
            COALESCE(p.income, 0) AS income
        FROM modes m
        LEFT JOIN (
            SELECT
                mode,
                SUM(amount) AS income
            FROM payments
            WHERE status = 2
            AND created_at::date BETWEEN $1::date AND $2::date
            GROUP BY mode
        ) p ON m.mode = p.mode;
  `,
    [from_date, to_date]
  );

  res.status(200).json(new ApiResponse(200, "Monthly income report", rows));
});

export const getPerDayAttendance = asyncErrorHandler(async (req, res) => {
  const { error, value } = VPerDayAttendance.validate(req.query);
  if (error) throw new ErrorHandler(400, error.message);

  let currentDate = '';
  if (value.date) {
    if (value.date && !isNaN(new Date(value.date).getTime())) {
      currentDate = value.date;
    } else {
       const date = new Date();
       currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
    
  } else {
    const date = new Date();
    currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  const { rows, rowCount } = await pool.query(
    `
    WITH total AS (
        SELECT COUNT(*) AS total_employee
        FROM "users"
        WHERE category != 'Student' AND category != 'Admin'
    ),
    present_count AS (
        SELECT COUNT(DISTINCT employee_id) AS present
        FROM attendance
        WHERE date::date = $1::date
    )
    SELECT
        t.total_employee,
        p.present,
        (t.total_employee - p.present) AS absent
    FROM total t
    CROSS JOIN present_count p;
    `,
    [currentDate]
  );

  if (rowCount === 0) throw new ErrorHandler(400, "No data found");

  res.status(200).json(new ApiResponse(200, "Present Date Count", rows[0]));
});
