import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { manageTeacherClassStatus } from "../services/attendance.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import {
  VAddAttendance,
  VEditTeacherClassStatus,
  VSingleAttendance,
} from "../validator/attendance.validator";

export const storeAttendance = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddAttendance.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  if (value.password !== process.env.PUNCH_ATTENDANCE_PASSWORD) {
    throw new ErrorHandler(403, "Forbidden");
  }

  const punchData = value.data as { userId: number; time: string }[];

  const placeholder = punchData
    .map(
      (_, index) =>
        `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 3 + 3
        }, CURRENT_DATE)`
    )
    .join(", ");

  await pool.query(
    `
     INSERT INTO attendance 
        (employee_id, in_time, status, date)
     VALUES
        ${placeholder}
     ON CONFLICT (employee_id, date) DO UPDATE
        SET out_time = EXCLUDED.in_time
    `,
    punchData.flatMap((item) => [item.userId, item.time, "Present"])
  );

  res.send("OK");
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

    WHERE u.category != 'Student'

    ORDER BY u.id DESC
    `
  );

  res.status(200).json(new ApiResponse(200, "Daily Attendance List", rows));
});

export const getSingleEmployeeAttendanceList = asyncErrorHandler(
  async (req, res) => {
    const { error, value } = VSingleAttendance.validate({ ...req.params, ...req.query });
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
      SELECT
        u.name,
        u.image,
        TO_CHAR(u.joining_date, 'DD FMMonth YYYY') AS joining_date,
        u.designation,
        COUNT(*) FILTER (WHERE a.status = 'Present') AS present_count,
        COUNT(*) FILTER (WHERE a.status = 'Absent') AS absent_count,
        COUNT(*) FILTER (WHERE a.status = 'Leave') AS total_taken_leave,
        10 - (COUNT(*) FILTER (WHERE a.status = 'Leave')) AS total_pending_leave
      FROM users u

      LEFT JOIN attendance a
      ON a.employee_id = u.id 
        AND a.date >= date_trunc('month', to_date($2, 'MM-YYYY')) 
        AND a.date < date_trunc('month', to_date($2, 'MM-YYYY')) + interval '1 month'

      WHERE u.id = $1

      GROUP BY u.id
    `;

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const { rows: attendanceInfo, rowCount } = await client.query(
        queryEmployeeAttendanceInfo,
        [value.id, monthStr]
      );

      if (rowCount === 0) throw new ErrorHandler(400, "No Data Found Of This Month");

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
  // const { rows } = await pool.query(
  //   `
  //     SELECT 
  //       u.id,
  //       u.name,
  //       COALESCE(
  //           JSON_AGG(ess) FILTER (WHERE ess.employee_id IS NOT NULL),
  //           '[]'::json
  //       ) AS for_courses
  //       FROM users u

  //       LEFT JOIN (
  //         SELECT 
  //             ess.employee_id,
  //             c.name AS course_name, 
  //             c.id,
  //             EXISTS (SELECT 1 FROM teacher_classes WHERE teacher_id = ess.employee_id AND course_id = c.id AND class_type = 'regular') AS regular, 
  //             EXISTS (SELECT 1 FROM teacher_classes WHERE teacher_id = ess.employee_id AND course_id = c.id AND class_type = 'workshop') AS workshop, 
  //             COALESCE((SELECT units FROM teacher_classes WHERE teacher_id = ess.employee_id AND course_id = c.id AND class_type = 'extra'), 0) AS extra 
  //           FROM employee_salary_structure ess 
  //           LEFT JOIN course c ON c.id = ess.course_id 
          
  //           GROUP BY ess.employee_id, c.id
  //       ) AS ess ON ess.employee_id = u.id

  //       WHERE u.category = 'Teacher'

  //       GROUP BY u.id

  //       ORDER BY u.id DESC
  //   `
  // )

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
            (COUNT(*) FILTER (WHERE tc.class_type = 'regular') > 0) AS regular,
            (COUNT(*) FILTER (WHERE tc.class_type = 'workshop') > 0) AS workshop,
            COALESCE(MAX(tc.units) FILTER (WHERE tc.class_type = 'extra'), 0) AS extra
          FROM employee_salary_structure ess 

          LEFT JOIN course c 
          ON c.id = ess.course_id

          LEFT JOIN teacher_classes tc 
          ON tc.teacher_id = ess.employee_id AND ess.course_id = tc.course_id

          GROUP BY ess.employee_id, c.id

          ORDER BY c.id
        ) AS ess ON ess.employee_id = u.id

        WHERE u.category = 'Teacher'

        GROUP BY u.id

        ORDER BY u.id DESC
    `
  )

  res.status(200).json(new ApiResponse(200, "Daily Teacher Class Status Info", rows))
})

export const editTeacherClassStatus = asyncErrorHandler(async (req, res) => {
  const { error, value } = VEditTeacherClassStatus.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const userId = value.id;

  await manageTeacherClassStatus({
    employee_id: userId,
    values: value.for_courses
  })

  res.status(200).json(new ApiResponse(200, "Class status updated"))
})
