import { pool } from "../../config/db";
import asyncErrorHandler from "../../middlewares/asyncErrorHandler";
import { ApiResponse } from "../../utils/ApiResponse";
import { ErrorHandler } from "../../utils/ErrorHandler";
import { generatePlaceholders } from "../../utils/generatePlaceholders";
import { parsePagination } from "../../utils/parsePagination";
import {
  VAddInventoryItemStockv2,
  VAddInventoryItemv2,
  VSingleInventoryItem,
  VUpdateInventoryItemv2,
} from "../../validator/v2/inventory.validator";

export const addInventoryItemV2 = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddInventoryItemv2.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.details[0].message);

  await pool.query(
    "INSERT INTO inventory_items_v2 (item_name, minimum_quantity, created_at) VALUES ($1, $2, $3)",
    [value.item_name, value.minimum_quantity, value.created_at]
  );

  res.status(201).json(new ApiResponse(201, "New inventory item added"));
});

export const addInventoryItemStockV2 = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddInventoryItemStockv2.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.details[0].message);

  const vendorInfo = value.vendors as {
    vendor: number;
    cost_per_unit: number;
  }[];

  if (vendorInfo.length === 0)
    throw new ErrorHandler(400, "Vendor info must be added");

  const { rowCount, rows } = await pool.query(
    "SELECT id FROM inventory_items_v2 WHERE id = $1 AND $2::DATE >= created_at",
    [value.item_id, value.transaction_date]
  );

  console.log(rows)

  const typeText = value.transaction_type === "add" ? "Add" : "Consume";
  if (rowCount === 0)
    throw new ErrorHandler(
      400,
      `You are not able to ${typeText} stock as ${typeText} Date is less than product addition date`
    );

  await pool.query(
    `
    INSERT INTO inventory_transactions_v2 
        (item_id, transaction_type, vendor_id, quantity, transaction_date, cost_per_unit, remark)
     VALUES
        ${generatePlaceholders(vendorInfo.length, 7)}
     `,
    vendorInfo.flatMap((item) => [
      value.item_id,
      value.transaction_type,
      item.vendor,
      value.quantity,
      value.transaction_date,
      item.cost_per_unit,
      value.remark,
    ])
  );
  const SUCCESS_MESSAGE =
    value.transaction_type === "add"
      ? "Stock Successfully Added"
      : "Stock Successfully Consumed";

  res.status(201).json(new ApiResponse(201, SUCCESS_MESSAGE));
});

export const updateInventoryItemInfoV2 = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdateInventoryItemv2.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query(
    "UPDATE inventory_items_v2 SET item_name = $1, minimum_quantity = $2, created_at = $3  WHERE id = $4",
    [value.item_name, value.minimum_quantity, value.created_at, value.id]
  );

  res.status(200).json(new ApiResponse(200, "Inventory item info updated"));
});

export const deleteInventoryItemV2 = asyncErrorHandler(async (req, res) => {
  await pool.query("DELETE FROM inventory_items_v2 WHERE id = $1", [
    req.params.item_id,
  ]);
  res.status(200).json(new ApiResponse(200, "Item Has Successfully Removed"));
});

export const getInventoryItemInfo = asyncErrorHandler(async (req, res) => {
  const { TO_STRING } = parsePagination(req);
  const { rows } = await pool.query(
    `
    SELECT
      ii.id,
      it.vendor_id,
      ii.item_name,
      ii.minimum_quantity,
      v.name AS vendor_name,
      TO_CHAR(MAX(it.transaction_date), 'DD Mon, YYYY') AS last_transaction_date,
      COALESCE(SUM(it.cost_per_unit * it.quantity) FILTER (WHERE it.transaction_type = 'add'), 0.00) AS total_expense,
      COALESCE(SUM(it.cost_per_unit * it.quantity) FILTER (WHERE it.transaction_type = 'consume'), 0.00) AS total_income,
      COALESCE(SUM(it.quantity) FILTER (WHERE it.transaction_type = 'add'), 0) - COALESCE(SUM(it.quantity) FILTER (WHERE it.transaction_type = 'consume'), 0) AS avilable_quantity,
      COALESCE(SUM(it.quantity) FILTER (WHERE it.transaction_type = 'consume'), 0) AS consume_quantity
    FROM inventory_items_v2 ii

    LEFT JOIN inventory_transactions_v2 it
    ON it.item_id = ii.id

    LEFT JOIN vendor v
    ON v.id = it.vendor_id

    GROUP BY v.id, it.vendor_id, ii.id

    ORDER BY ii.id DESC

    ${TO_STRING}
    `
  );

  res.status(200).json(new ApiResponse(200, "Inventory Item List", rows));
});

export const getSingleInventoryItemInfo = asyncErrorHandler(
  async (req, res) => {
    const { error, value } = VSingleInventoryItem.validate(req.params ?? {});
    if (error) throw new ErrorHandler(400, error.message);

    const { rows, rowCount } = await pool.query(
      "SELECT *, TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at FROM inventory_items_v2 WHERE id = $1",
      [value.id]
    );

    if (rowCount === 0) throw new ErrorHandler(404, "No inventory item found");

    res.status(200).json(new ApiResponse(200, "", rows[0]));
  }
);
