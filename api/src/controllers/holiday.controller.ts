import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { parsePagination } from "../utils/parsePagination";
import {
  VCreateHoliday,
  VDeleteHoliday,
  VUpdateHoliday,
} from "../validator/holiday.validator";

export const addHolidayInfo = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateHoliday.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query(
    "INSERT INTO holiday (holiday_name, date) VALUES ($1, $2::DATE)",
    [value.holiday_name, value.date]
  );

  res.status(201).json(new ApiResponse(201, "New Holiday created"));
});

export const updateHolidayInfo = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdateHoliday.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query(
    "UPDATE holiday SET holiday_name = $1, date = $2::DATE WHERE id = $3",
    [value.holiday_name, value.date, value.id]
  );

  res.status(200).json(new ApiResponse(200, "Holiday info updated"));
});

export const deleteHolidayInfo = asyncErrorHandler(async (req, res) => {
  const { error, value } = VDeleteHoliday.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query("DELETE FROM holiday WHERE id = $1", [value.id]);

  res.status(200).json(new ApiResponse(200, "Holiday removed"));
});

export const getHolidayList = asyncErrorHandler(async (req, res) => {
  const { TO_STRING } = parsePagination(req);

  let filter = "";
  const filterValues: string[] = [];
  let placeholder = 1;

  const year = req.query.year;

  if (year) {
    const startDate = `${year}-01-01`;
    const endDate = `${parseInt(year.toString()) + 1}-01-01`;

    filter += `WHERE date >= $${placeholder++} AND date < $${placeholder++}`;
    filterValues.push(startDate);
    filterValues.push(endDate);
  }

  const { rows } = await pool.query(
    `
      SELECT
       id,
       holiday_name,
       TO_CHAR(date, 'YYYY-MM-DD') AS date
      FROM holiday

      ${filter}

      ORDER BY id DESC

      ${TO_STRING}
    `,
    filterValues
  );

  res.status(200).json(new ApiResponse(200, "Holiday list", rows));
});

export const getSingleHoliday = asyncErrorHandler(async (req, res) => {
  const { error, value } = VDeleteHoliday.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const { rows, rowCount } = await pool.query(
    "SELECT id, holiday_name, TO_CHAR(date, 'YYYY-MM-DD') AS date FROM holiday WHERE id = $1",
    [value.id]
  );
  if (rowCount === 0) throw new ErrorHandler(400, "No holiday item found");

  res.status(200).json(new ApiResponse(200, "Single Holiday List", rows[0]));
});
