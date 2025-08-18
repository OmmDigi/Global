import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import {
  objectToSqlConverterUpdate,
  objectToSqlInsert,
} from "../utils/objectToSql";
import { parsePagination } from "../utils/parsePagination";
import {
  VAddPurchase,
  VSingleValidator,
  VUpdatePurchase,
} from "../validator/purchase.validator";

export const addPurchaseRecord = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddPurchase.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const { columns, values, params } = objectToSqlInsert(value);

  await pool.query(
    `INSERT INTO purchase_record ${columns} VALUES ${params}`,
    values
  );

  res.status(201).json(new ApiResponse(201, "New purchase record added"));
});

export const updatePurchaseRecord = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdatePurchase.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const update_id = value.id;
  delete value.id;
  const { keys, paramsNum, values } = objectToSqlConverterUpdate(value);
  values.push(update_id);

  await pool.query(
    `UPDATE purchase_record SET ${keys} WHERE id = $${paramsNum}`,
    values
  );
});

export const getSinglePurchaseRecord = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleValidator.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const { rows, rowCount } = await pool.query(
    `SELECT *, TO_CHAR(purchase_date, 'YYYY-MM-DD') as purchase_date, TO_CHAR(expaire_date, 'YYYY-MM-DD') AS expaire_date FROM purchase_record WHERE id = $1`,
    [value.id]
  );
  if (rowCount === 0) throw new ErrorHandler(404, "No data found");

  res.status(200).json(new ApiResponse(200, "Single Purchase Record", rows[0]));
});

export const getPurchaseRecordList = asyncErrorHandler(async (req, res) => {
  const { TO_STRING } = parsePagination(req);
  const { rows } = await pool.query(
    `SELECT * FROM purchase_record ORDER BY id DESC ${TO_STRING}`
  );
  res.status(200).json(new ApiResponse(200, "Purchase Record List", rows));
});

// export const deletePurchaseRecored = asyncErrorHandler(async (req, res) => {
//   const { error, value } = VSingleValidator.validate(req.params ?? {});
//   if (error) throw new ErrorHandler(400, error.message);

//   await pool.query("DELETE FROM purchase_record WHERE ");
// });
