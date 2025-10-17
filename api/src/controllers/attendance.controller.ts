import { Worker } from "node:worker_threads";
import { pool } from "../config/db";
import { essl } from "../config/essl";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { manageTeacherClassStatus } from "../services/attendance.service";
import { TFinalPunch } from "../types";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { storeAttendanceDataToDb } from "../utils/storeAttendanceDataToDb";
import {
  VAddAttendance,
  VEditTeacherClassStatus,
  VGetTeacherClassList,
  VSingleAttendance,
} from "../validator/attendance.validator";
import path from "node:path";

export const storeAttendance = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddAttendance.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  if (value.password !== process.env.PUNCH_ATTENDANCE_PASSWORD) {
    throw new ErrorHandler(403, "Forbidden");
  }

  const punchData = value.data as { userId: number; time: string }[];

  // Step 1: group punches by userId + date
  const grouped = Object.values(
    punchData.reduce((acc, item) => {
      const date = item.time.split(" ")[0]; // get YYYY-MM-DD
      const key = `${item.userId}-${date}`;

      if (!acc[key]) {
        acc[key] = {
          userId: item.userId,
          inTime: item.time,
          outTime: item.time,
          status: "Present",
          date,
        };
      } else {
        const current = new Date(item.time);
        const inTime = new Date(acc[key].inTime);
        const outTime = new Date(acc[key].outTime);

        // // earliest punch = in_time
        // if (item.time < acc[key].inTime) acc[key].inTime = item.time;
        // // latest punch = out_time
        // if (item.time > acc[key].outTime) acc[key].outTime = item.time;

        if (current < inTime) acc[key].inTime = item.time;
        if (current > outTime) acc[key].outTime = item.time;
      }

      return acc;
    }, {} as Record<string, any>)
  );

  const finalPunches = grouped as TFinalPunch[];

  const { success, message } = await storeAttendanceDataToDb(finalPunches);

  if (!success) {
    throw new ErrorHandler(400, message);
  }

  res.send("OK");

  // Step 3: execute bulk insert with ON CONFLICT
  // await pool.query(
  //   `
  //  INSERT INTO attendance
  //     (employee_id, in_time, out_time, status, date)
  //  VALUES
  //    ${placeholder}
  //  ON CONFLICT (employee_id, date) DO UPDATE
  //  SET
  //     in_time = CASE
  //                 WHEN attendance.in_time IS NULL THEN EXCLUDED.in_time
  //                 ELSE attendance.in_time
  //               END,
  //     out_time = GREATEST(attendance.out_time, EXCLUDED.out_time),
  //     status = EXCLUDED.status
  // `,
  //   finalPunches.flatMap((item) => [
  //     item.userId,
  //     item.inTime,
  //     item.outTime,
  //     item.status,
  //     item.date,
  //   ])
  // );

  // await pool.query(
  //   `
  //   INSERT INTO attendance (employee_id, in_time, out_time, status, date)
  //   VALUES ${placeholder}
  //   ON CONFLICT (employee_id, date)
  //   DO UPDATE SET
  //     in_time = COALESCE(attendance.in_time, EXCLUDED.in_time),
  //     out_time = CASE
  //                 -- only update out_time if record already exists (not on insert)
  //                 WHEN attendance.out_time IS NOT NULL OR attendance.in_time IS NOT NULL
  //                 THEN GREATEST(attendance.out_time, EXCLUDED.out_time)
  //                 ELSE attendance.out_time
  //               END,
  //     status = EXCLUDED.status;
  //   `,
  //   finalPunches.flatMap((item) => [
  //     item.userId,
  //     item.inTime,
  //     item.outTime, // can be non-null, but we’ll ignore it on first insert
  //     item.status,
  //     item.date,
  //   ])
  // );
});

export const getAttendanceList = asyncErrorHandler(async (req, res) => {
  const { rows } = await pool.query(
    `
    SELECT
        u.id,
        u.image,
        u.name,
        u.designation,
        TO_CHAR(a.in_time, 'HH12:MI:SS am') AS in_time,
        TO_CHAR(a.out_time, 'HH12:MI:SS am') AS out_time,
    CASE
        WHEN h.date IS NOT NULL THEN 'Holiday'
        WHEN EXTRACT(DOW FROM CURRENT_DATE) = 0 THEN 'Sunday'
        ELSE a.status
    END AS status
    FROM users u

    LEFT JOIN attendance a
    ON a.employee_id = u.id AND a.date = CURRENT_DATE

    LEFT JOIN holiday h
    ON h.date = CURRENT_DATE

    WHERE u.category != 'Student' AND u.category != 'Admin'

    ORDER BY u.id DESC
    `
  );

  res.status(200).json(new ApiResponse(200, "Daily Attendance List", rows));
});

export const getSingleEmployeeAttendanceList = asyncErrorHandler(
  async (req, res) => {
    const { error, value } = VSingleAttendance.validate({
      ...req.params,
      ...req.query,
    });
    if (error) throw new ErrorHandler(400, error.message);

    let monthYear = value.month_year;

    let monthStr, firstDayStr;

    if (!monthYear) {
      // No month given → use current month
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");

      monthStr = `${mm}-${yyyy}`; // e.g. "2025-08-01" (safe for Postgres)
      firstDayStr = `01-${mm}-${yyyy}`; // e.g. "01-08-2025"
    } else {
      // Month provided → add "-01" for full date
      const [yyyy, mm] = monthYear.split("-");
      monthStr = `${mm}-${yyyy}`; // e.g. "2025-05-01"
      firstDayStr = `01-${mm}-${yyyy}`; // e.g. "01-05-2025"
    }

    const queryGetAttenList = `
      WITH month_days AS (
          SELECT generate_series(
            date_trunc('month', to_date($2, 'DD-MM-YYYY')),
            LEAST(
              date_trunc('month', to_date($2, 'DD-MM-YYYY')) + interval '1 month' - interval '1 day',
              CURRENT_DATE
            ),
            interval '1 day'
          )::date AS day
      )
      SELECT 
          to_char(md.day, 'DD-MM-YYYY') AS date,
          to_char(a.in_time, 'HH12:MI am') AS in_time,
          to_char(a.out_time, 'HH12:MI am') AS out_time,
          CASE 
              WHEN h.holiday_name IS NOT NULL THEN h.holiday_name  -- If holiday exists
              WHEN EXTRACT(DOW FROM md.day) = 0 THEN 'Sunday'      -- If Sunday
              ELSE a.status                                        -- Otherwise attendance status
          END AS status
      FROM month_days md
      LEFT JOIN attendance a
          ON a.date = md.day
          AND a.employee_id = $1
      LEFT JOIN holiday h
          ON h.date = md.day
      ORDER BY md.day;
    `;

    const queryEmployeeAttendanceInfo = `
      WITH monthly_holidays AS (
          -- Pre-calculate holidays per month for better performance
          SELECT 
              DATE_TRUNC('month', h.date) AS month,
              COUNT(*) AS holiday_count
          FROM holiday h
          GROUP BY DATE_TRUNC('month', h.date)
      ),
      employee_info AS (
          -- Get basic employee info once to avoid repeated joins
          SELECT 
              u.id,
              u.name,
              u.image,
              u.joining_date,
              u.designation,
              u.joining_date + INTERVAL '1 year' AS eligible_start_date
          FROM users u
          WHERE u.id = $1
      ),
      valid_months AS (
          -- Count eligible months with optimized logic
          SELECT COUNT(*) AS eligible_months
          FROM (
              SELECT DATE_TRUNC('month', a.date) AS month
              FROM attendance a
              JOIN employee_info ei ON ei.id = a.employee_id
              LEFT JOIN monthly_holidays mh ON mh.month = DATE_TRUNC('month', a.date)
              WHERE a.date >= ei.eligible_start_date
                AND a.date < DATE_TRUNC('month', CURRENT_DATE)
              GROUP BY DATE_TRUNC('month', a.date), COALESCE(mh.holiday_count, 0)
              HAVING COUNT(*) FILTER (WHERE a.status IN ('Present', 'Leave')) >= 
                    (26 - COALESCE(mh.holiday_count, 0))
          ) vm
      ),
      monthly_attendance AS (
          -- Calculate monthly attendance for the specified month
          SELECT
              COUNT(*) FILTER (WHERE a.status = 'Present') AS present_count,
              COUNT(*) FILTER (WHERE a.status IN ('Absent', 'Leave')) AS absent_count
          FROM employee_info ei
          LEFT JOIN attendance a ON a.employee_id = ei.id 
              AND a.date >= DATE_TRUNC('month', TO_DATE($2, 'MM-YYYY'))
              AND a.date < DATE_TRUNC('month', TO_DATE($2, 'MM-YYYY')) + INTERVAL '1 month'
      ),
      total_leave_info AS (
          -- Calculate total approved leaves since eligibility
          SELECT COALESCE(SUM(l.to_date - l.from_date + 1), 0) AS total_taken_leave
          FROM employee_info ei
          LEFT JOIN leave l ON l.employee_id = ei.id
              AND l.status = 2 -- Approved leaves only
              AND l.from_date >= ei.eligible_start_date
      )
      SELECT
          ei.name,
          ei.image,
          TO_CHAR(ei.joining_date, 'DD FMMonth YYYY') AS joining_date,
          ei.designation,
          ma.present_count,
          ma.absent_count,
          tli.total_taken_leave,
          GREATEST(0, vm.eligible_months - tli.total_taken_leave) AS total_pending_leave
      FROM employee_info ei
      CROSS JOIN valid_months vm
      CROSS JOIN monthly_attendance ma
      CROSS JOIN total_leave_info tli;
`;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { rows: attendanceInfo, rowCount } = await client.query(
        queryEmployeeAttendanceInfo,
        [value.id, monthStr]
      );

      if (rowCount === 0)
        throw new ErrorHandler(400, "No Data Found Of This Month");

      const { rows: attendanceList } = await client.query(queryGetAttenList, [
        value.id,
        firstDayStr,
      ]);

      await client.query("COMMIT");

      res.status(200).json(
        new ApiResponse(200, "", {
          ...attendanceInfo[0],
          attendance_list: attendanceList,
        })
      );
    } catch (e: any) {
      await client.query("ROLLBACK");
      throw new ErrorHandler(400, e.message);
    } finally {
      client.release();
    }
  }
);

// Teacher Class Status
export const getTeacherClassStatusList = asyncErrorHandler(async (req, res) => {
  const { error, value } = VGetTeacherClassList.validate(req.query ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  let placeholder = 1;
  let tcFilter = "tc.class_date = CURRENT_DATE";
  let attendanceFilter = "attendance.date = CURRENT_DATE";
  const filterValues: string[] = [];

  if (value.date) {
    tcFilter = `tc.class_date = $${placeholder}::date`;
    attendanceFilter = `attendance.date = $${placeholder}::date`;
    filterValues.push(value.date);
    placeholder++;
  }

  const { rows } = await pool.query(
    `
      SELECT 
        u.id,
        u.name,
        COALESCE(
            JSON_AGG(ess) FILTER (WHERE ess.employee_id IS NOT NULL),
            '[]'::json
        ) AS for_courses
        FROM users u

        LEFT JOIN (
          SELECT 
            ess.employee_id,
            c.name AS course_name, 
            c.id,
            (COUNT(*) FILTER (WHERE tc.class_type = 'fixed' OR tc.class_type = 'per_class') > 0) AS regular,
            (COUNT(*) FILTER (WHERE tc.class_type = 'workshop') > 0) AS workshop,
            COALESCE(MAX(tc.units) FILTER (WHERE tc.class_type = 'extra'), 0) AS extra
          FROM employee_salary_structure ess 

          LEFT JOIN course c 
          ON c.id = ess.course_id

          LEFT JOIN teacher_classes tc 
          ON tc.teacher_id = ess.employee_id AND ess.course_id = tc.course_id AND ${tcFilter}

          GROUP BY ess.employee_id, c.id

          ORDER BY c.id
        ) AS ess ON ess.employee_id = u.id

        WHERE u.category = 'Teacher' AND EXISTS (SELECT 1 FROM attendance WHERE employee_id = u.id AND ${attendanceFilter})

        GROUP BY u.id

        ORDER BY u.id DESC
    `,
    filterValues
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Daily Teacher Class Status Info", rows));
});

export const editTeacherClassStatus = asyncErrorHandler(async (req, res) => {
  const { error, value } = VEditTeacherClassStatus.validate({
    ...req.body,
    ...req.query,
  });
  if (error) throw new ErrorHandler(400, error.message);

  const userId = value.id;

  await manageTeacherClassStatus({
    employee_id: userId,
    values: value.for_courses,
    date: value.date,
  });

  res.status(200).json(new ApiResponse(200, "Class status updated"));
});

//sync attendance form the device
export const syncAttendanceFromTheDevice = asyncErrorHandler(
  async (req, res) => {
    try {
      await essl.syncAttendance();
    } catch (error: any) {
      throw new ErrorHandler(400, error.message);
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Attendance sync request successfully processed wait for some time"
        )
      );
  }
);

export const processAttendaceToTheDb = asyncErrorHandler(async (req, res) => {
  if (req.body?.password != process.env.PROCESS_ATTENDANCE_PASSWORD) {
    throw new ErrorHandler(401, "Unauthorized");
  }

  // const filepath = req.body.filepath;
  const filepath = req.body?.filepath;

  if (!filepath) throw new ErrorHandler(400, "Filepath is required");

  const workerProcessPath = path.resolve(
    __dirname,
    "../workers/processAttendance.ts"
  );

  const worker = new Worker(workerProcessPath, {
    workerData: { filepath },
    execArgv: ["-r", "ts-node/register"],
  });

  // Listen for messages from the worker
  worker.on("message", (result) => {
    console.log("Message From Worker Thread, : ", result);
    res.send("Processing done");
  });

  // Handle errors from the worker
  worker.on("error", (error) => {
    console.log("Error in worker thread", error);
    res.status(400).json(new ApiResponse(400, error.message));
  });

  // Handle worker exit (optional)
  worker.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
});
