import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { parsePagination } from "../utils/parsePagination";
import { VSendNotice, VSingleNotice } from "../validator/notice.validator";

export const sendNotice = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSendNotice.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      "INSERT INTO notice (title, description) VALUES ($1, $2) RETURNING id",
      [value.title, value.description]
    );
    const notice_id = rows[0].id;

    const send_to = value.send_to as number[];

    const colume_to_add =
      value.type === "Stuff"
        ? "(notice_id, user_id)"
        : "(notice_id, course_id)";
    const placeholders = send_to
      .map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`)
      .join(", ");

    await client.query(
      `INSERT INTO notice_sent ${colume_to_add} VALUES ${placeholders}`,
      send_to.flatMap((id) => [notice_id, id])
    );
    await client.query("COMMIT");

    res.status(200).json(new ApiResponse(200, "Notice Successfully Sent"));
  } catch (error: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, error.message);
  } finally {
    client.release();
  }
});

export const getNoticeList = asyncErrorHandler(async (req, res) => {
  const { TO_STRING } = parsePagination(req)
  const { rows } = await pool.query(
    `
        SELECT 
          n.*,
          JSON_AGG(COALESCE(u.name, c.name)) AS send_to,
          TO_CHAR(n.created_at, 'DD FMMonth YYYY') AS created_at
        FROM notice n
        LEFT JOIN notice_sent ns
        ON ns.notice_id = n.id

        LEFT JOIN users u
        ON u.id = ns.user_id

        LEFT JOIN course c
        ON c.id = ns.course_id

        GROUP BY n.id

        ORDER BY n.id DESC

        ${TO_STRING}
        `
  );

  res.status(200).json(new ApiResponse(200, "Data To Send", rows));
});

export const deleteNotice = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleNotice.validate(req.params ?? {});
  if(error) throw new ErrorHandler(400, error.message);
  await pool.query("DELETE FROM notice WHERE id = $1", [value.id]);
  res.status(200).json(new ApiResponse(200, "Notice successfully removed"))
})
