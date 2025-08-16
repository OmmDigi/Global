import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { generatePlaceholders } from "../utils/generatePlaceholders";
import { objectToSqlConverterUpdate } from "../utils/objectToSql";
import { parsePagination } from "../utils/parsePagination";
import {
  VMultiInvertoryItemAdd,
  VMultiInvertoryStockAdd,
  VUPdateSingleInventoryItemInfo,
} from "../validator/inventory.validator";

export const addNewInventoryItem = asyncErrorHandler(async (req, res) => {
  const { error, value } = VMultiInvertoryItemAdd.validate(req.body ?? []);
  if (error) throw new ErrorHandler(400, error.message);

  if(value.length === 0) throw new ErrorHandler(400, "Item info must be added")

  await pool.query(
    `INSERT INTO inventory_items 
      (item_name, where_to_use, used_by, description, minimum_quantity, vendor_id, created_at) 
     VALUES ${generatePlaceholders(value.length, 7)}`,
    value.flatMap((item) => [
      item.item_name,
      item.where_to_use,
      item.used_by,
      item.description,
      item.minimum_quantity,
      item.vendor_id,
      item.created_at,
    ])
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        `Inventory ${
          value.length === 1 ? "Item Has" : "Items Are"
        } Successfully Added`
      )
    );
});

export const addItemStock = asyncErrorHandler(async (req, res) => {
  const { error, value } = VMultiInvertoryStockAdd.validate(req.body ?? []);
  if (error) throw new ErrorHandler(400, error.message);

  if(value.length === 0) throw new ErrorHandler(400, "Item Stock must be added")

  await pool.query(
    `
      INSERT INTO inventory_transactions 
        (item_id, transaction_type, quantity, quantity_status, transaction_date, cost_per_unit, total_value, remark)
      VALUES ${generatePlaceholders(value.length, 8)}
    `,
    value.flatMap((item) => [
      item.item_id,
      item.transaction_type,
      item.quantity,
      item.quantity_status,
      item.transaction_date,
      item.cost_per_unit,
      // item.total_value,
      parseInt(item.quantity) * parseInt(item.cost_per_unit),
      item.remark,
    ])
  );

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        `Item ${
          value.length === 1 ? "Stock Has" : "Stocks Are"
        } Successfully Added`
      )
    );
});

export const getCurrentDateReport = asyncErrorHandler(async (req, res) => {
  const currentDate = new Date();
  // Get the year, month, and day
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(currentDate.getDate()).padStart(2, "0");
  // Format the date as 'YYYY-MM-DD'
  const formattedDate = `${year}-${month}-${day}`;

  const { LIMIT, OFFSET } = parsePagination(req);

  let filter = "WHERE report_date BETWEEN $1 AND $2";
  const filterValues: string[] = [formattedDate, formattedDate];
  let placeholderNum = 3;

  if (req.query.search) {
    filter += ` AND item_name ILIKE '%' || $${placeholderNum} || '%'`;
    placeholderNum++;
    filterValues.push(req.query.search as string);
  }

  const { rows } = await pool.query(
    `
     WITH
      -- Step 1: Get the earliest transaction date (or default to $1)
      min_required_date AS (
        SELECT MIN(transaction_date) AS min_date
        FROM inventory_transactions
        WHERE transaction_date <= $2
      ),
      
      -- Step 2: Generate full date series from earliest available transaction date or $1
      date_range AS (
        SELECT generate_series(
          LEAST(COALESCE((SELECT min_date FROM min_required_date), $1), $1),
          $2,
          INTERVAL '1 day'
        )::DATE AS report_date
      ),
      
      -- Step 3: Pair every item with every date
      inventory_dates AS (
        SELECT i.item_id, i.item_name, i.where_to_use, i.used_by, i.description, i.minimum_quantity, i.vendor_id, d.report_date
        FROM inventory_items i
        CROSS JOIN date_range d
        
        WHERE d.report_date >= i.created_at::date
      ),
      
      -- Step 4: Sum of transactions per item per day
      transactions_grouped AS (
        SELECT
          tg.item_id,
          tg.transaction_date,
          tg.total_cost_per_unit,
          tg.total_added,
          tg.total_consumed,
          ls.quantity_status,
          ls.remark,
          tg.total_value
        FROM (
          SELECT
            item_id,
            transaction_date,
            SUM(cost_per_unit) AS total_cost_per_unit,
            SUM(CASE WHEN transaction_type = 'add' THEN quantity ELSE 0 END) AS total_added,
            SUM(CASE WHEN transaction_type = 'consume' THEN quantity ELSE 0 END) AS total_consumed,
            SUM(total_value) AS total_value
          FROM inventory_transactions
          GROUP BY item_id, transaction_date
        ) tg
        LEFT JOIN LATERAL (
          SELECT quantity_status, remark
          FROM inventory_transactions t
          WHERE t.item_id = tg.item_id AND t.transaction_date = tg.transaction_date AND transaction_type = 'add'
          ORDER BY t.inventory_transaction_id DESC  -- or created_at DESC if available
          LIMIT 1
        ) ls ON TRUE
      ),
      
      -- Step 5: Merge items and their daily transactions
      daily_stock_data AS (
        SELECT
          idr.item_id,
          idr.item_name,
          idr.where_to_use,
          idr.used_by,
          idr.description,
          idr.minimum_quantity,
          idr.vendor_id,
          idr.report_date,
          tg.quantity_status,
          tg.remark,
          COALESCE(tg.total_added, 0) AS added,
          COALESCE(tg.total_consumed, 0) AS consumed,
          COALESCE(tg.total_cost_per_unit, 0) AS cost_per_unit_current,
          COALESCE(tg.total_value, 0) AS total_value,
          ltd.last_transaction_date
        FROM inventory_dates idr

        LEFT JOIN transactions_grouped tg
          ON idr.item_id = tg.item_id AND idr.report_date = tg.transaction_date

        LEFT JOIN LATERAL (
          SELECT transaction_date AS last_transaction_date
          FROM inventory_transactions t
          WHERE t.item_id = idr.item_id AND t.transaction_date <= idr.report_date AND t.transaction_type = 'add'
          ORDER BY t.transaction_date DESC, t.inventory_transaction_id DESC
          LIMIT 1
        ) ltd ON TRUE

      ),
      
      -- Step 6: Rolling stock calculation
      cumulative_stock AS (
        SELECT
          dsd.*,
          LAG(cost_per_unit_current, 1, 0) OVER (
            PARTITION BY dsd.item_id
            ORDER BY dsd.report_date
          ) AS cost_per_unit_prev,
          SUM(added - consumed) OVER (
            PARTITION BY dsd.item_id
            ORDER BY dsd.report_date
            ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
          ) AS opening_stock
        FROM daily_stock_data AS dsd
      )
      
      -- Step 7: Show final report within user-selected date range
      SELECT
        item_id,
        item_name,
        where_to_use,
        used_by,
        description,
        minimum_quantity,
        cumulative_stock.vendor_id,
        v.name AS vendor_name,
        TO_CHAR(report_date, 'YYYY-MM-DD') AS created_at,
        COALESCE(opening_stock, 0) AS opening_stock,
        added,
        consumed,
        COALESCE(opening_stock, 0) + added - consumed AS closing_stock,
        COALESCE(cost_per_unit_prev, 0) AS cost_per_unit_prev,
        cost_per_unit_current,
        total_value,
        quantity_status,
        remark,
        TO_CHAR(last_transaction_date, 'FMDD FMMonth, YYYY') AS last_transaction_date
      FROM cumulative_stock

      LEFT JOIN vendor v
      ON v.id = cumulative_stock.vendor_id

      ${filter}
      ORDER BY item_id, report_date

      LIMIT ${LIMIT} OFFSET ${OFFSET}

    `,
    filterValues
  );

  res.status(200).json(new ApiResponse(200, "Current Date Item Info", rows));
});

export const editItemInfo = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUPdateSingleInventoryItemInfo.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const update_id = value.item_id;
  delete value.item_id;
  const { keys, values, paramsNum } = objectToSqlConverterUpdate(value);
  if(values.length === 0) throw new ErrorHandler(400, "Nothing to update");
  values.push(update_id);

  await pool.query(
    `UPDATE inventory_items SET ${keys} WHERE item_id = $${paramsNum}`,
    values
  );

  res.status(200).json(new ApiResponse(200, "Item Info Has Updated"));
});

export const getSingleInventoryItemInfo = asyncErrorHandler(
  async (req, res) => {
    const { rowCount, rows } = await pool.query(
      `SELECT *, TO_CHAR(created_at, 'YYYY-MM-DD') AS created_at FROM inventory_items WHERE item_id = $1`,
      [req.params.item_id]
    );

    if (rowCount === 0) throw new ErrorHandler(404, "No Item Found");

    res.status(200).json(new ApiResponse(200, "New Item Has Added", rows[0]));
  }
);

export const deleteInventoryItem = asyncErrorHandler(async (req, res) => {
  await pool.query("DELETE FROM inventory_items WHERE item_id = $1", [
    req.params.item_id,
  ]);
  res.status(200).json(new ApiResponse(200, "Item Has Successfully Removed"));
});
