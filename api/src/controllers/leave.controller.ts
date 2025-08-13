import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { getLeaveList } from "../services/leave.service";
import { CustomRequest } from "../types";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import {
  VCreateLeave,
  VSingleLeave,
  VUpdateLeaveStatus,
} from "../validator/leave.validator";

export const createLeaveRequest = asyncErrorHandler(
  async (req: CustomRequest, res) => {
    const { error, value } = VCreateLeave.validate({
      ...req.body,
      employee_id: req.user_info?.id,
    });
    if (error) throw new ErrorHandler(400, error.message);

    const query = `
    INSERT INTO leave (employee_id, from_date, to_date, reason)
    SELECT $1, $2::date, $3::date, $4
    WHERE $2::date >= CURRENT_DATE
        AND $3::date >= CURRENT_DATE
    `;

    const { rowCount } = await pool.query(query, [
      value.employee_id,
      value.from_date,
      value.to_date,
      value.reason,
    ]);

    if (rowCount === 0)
      throw new ErrorHandler(
        400,
        "Leave not inserted: dates are before today."
      );

    res.status(201).json(new ApiResponse(201, "Leave request created"));
  }
);

export const getLeaveRequestList = asyncErrorHandler(async (req, res) => {
  const { rows } = await getLeaveList(req);
  res.status(200).json(new ApiResponse(200, "Leave list", rows));
});

export const deleteLeaveRequest = asyncErrorHandler(async (req, res) => {
  // if leave status is pending (1) at that time leave will removed
  const { error, value } = VSingleLeave.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const { rowCount } = await pool.query(
    ` 
    DELETE FROM leave
    WHERE id = $1 AND status = 1
    RETURNING id;
    `,
    [value.id]
  );
  if (rowCount === 0)
    throw new ErrorHandler(400, "Only Pending leave can be delete");

  res.status(200).json(new ApiResponse(200, "Leave request deleted"));
});

export const updateLeaveStatus = asyncErrorHandler(async (req, res) => {
  // while updating leave request we need to check is the current person has permission or not
  // if leave status update -> Approved insert a new rows in attendance table | rejected -> Remove attendace of that date

  const { error, value } = VUpdateLeaveStatus.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const status_id = value.status === "Approved" ? 2 : 3;

    const { rows, rowCount } = await client.query(
      "UPDATE leave SET status = $1 WHERE id = $2 RETURNING from_date, to_date",
      [status_id, value.id]
    );

    if (rowCount === 0) throw new ErrorHandler(404, "Leave request not found");

    const from_date = rows[0].from_date;
    const to_date = rows[0].to_date;

    await client.query(
      "DELETE FROM attendance WHERE employee_id = $1 AND date BETWEEN $2 AND $3",
      [value.employee_id, from_date, to_date]
    );

    if (status_id === 2) {
      await client.query(
        `
        INSERT INTO attendance (employee_id, date, status)
        SELECT $1, gs::date, $2
        FROM generate_series($3::date, $4::date, interval '1 day') gs`,
        [value.employee_id, "Leave", from_date, to_date]
      );
    }

    await client.query("COMMIT");

    res.status(200).json(new ApiResponse(200, "Leave status updated"));
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.log(error);
    throw new ErrorHandler(400, error.message);
  } finally {
    client.release();
  }
});
