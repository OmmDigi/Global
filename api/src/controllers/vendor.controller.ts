import { Request, Response } from "express";
import { pool } from "../config/db";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { parsePagination } from "../utils/parsePagination";
import { ErrorHandler } from "../utils/ErrorHandler";
import {
  objectToSqlConverterUpdate,
  objectToSqlInsert,
} from "../utils/objectToSql";
// import { generatePlaceholders } from "../utils/generatePlaceholders";
import {
  addNewVendorValidator,
  deleteVendorValidator,
  updateVendorValidator,
} from "../validator/vendor.validator";

//Vendor
export const getVendorDropdown = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { rows } = await pool.query(
      `
      SELECT 
        id,
        name
      FROM vendor
      ORDER BY created_at DESC
      `
    );
    res.status(200).json(new ApiResponse(200, "", rows));
  }
);

export const getVendorList = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { LIMIT, OFFSET } = parsePagination(req);

    //for filters
    let filter = "";
    const filterValues: any[] = [];
    Object.entries(req.query).forEach(([key, value], index) => {
      if (filter === "") filter = "WHERE";

      if (index === 0) {
        filter += ` ${key} = $${index + 1}`;
      } else {
        filter += ` AND ${key} = $${index + 1}`;
      }
      filterValues.push(value);
    });

    const { rows } = await pool.query(
      `
      SELECT 
        *
      FROM vendor
      ${filter}
      ORDER BY created_at DESC
      LIMIT ${LIMIT} OFFSET ${OFFSET}
      `,
      filterValues
    );
    res.status(200).json(new ApiResponse(200, "", rows));
  }
);

export const getSingleVendorInfo = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { rows, rowCount } = await pool.query(
      `SELECT * FROM vendor WHERE id = $1`,
      [req.params.id]
    );

    if (rowCount === 0) throw new ErrorHandler(400, "No Vendor Info Exist");

    res.status(200).json(new ApiResponse(200, "", rows[0]));
  }
);

export const addNewVendorItem = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { error } = addNewVendorValidator.validate(req.body);
    if (error) throw new ErrorHandler(400, error.message);

    const { columns, params, values } = objectToSqlInsert(req.body);
    await pool.query(`INSERT INTO vendor ${columns} VALUES ${params}`, values);

    res.status(201).json(new ApiResponse(201, "New Vendor Has Added"));
  }
);

// export const addMultipleVendorItem = asyncErrorHandler(
//   async (req: Request, res: Response) => {
//     const { error, value } = addMultipleVendorItemValidator.validate(req.body);
//     if (error) throw new ErrorHandler(400, error.message);

//     await pool.query(
//       `INSERT INTO vendor (name, service_type, address, contact_details, institute) VALUES ${
//         generatePlaceholders(5, value.length)
//       }`,
//       value.flatMap((item) => [
//         item.name,
//         item.service_type,
//         item.address,
//         item.contact_details,
//         item.institute,
//       ])
//     );

//     res.status(201).json(new ApiResponse(201, "Vendor Information Saved"));
//   }
// );

export const updateVendorItem = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { error, value } = updateVendorValidator.validate(req.body ?? {});
    if (error) throw new ErrorHandler(400, error.message);

    const update_id = value.id;
    delete value.id;
    const { keys, values, paramsNum } = objectToSqlConverterUpdate(value);
    values.push(update_id);
    await pool.query(
      `UPDATE vendor SET ${keys} WHERE id = $${paramsNum}`,
      values
    );

    res.status(200).json(new ApiResponse(200, "Vendor Info Has Updated"));
  }
);

export const deleteVendorItem = asyncErrorHandler(
  async (req: Request, res: Response) => {
    const { error } = deleteVendorValidator.validate(req.params);
    if (error) throw new ErrorHandler(400, error.message);

    await pool.query(`DELETE FROM vendor WHERE id = $1`, [req.params.id]);

    res.status(200).json(new ApiResponse(200, "Vendor Has Deleted"));
  }
);

// export const getVendorFiltersItemInfo = asyncErrorHandler(
//   async (req: Request, res: Response) => {
//     const { rows } = await pool.query(
//       `SELECT
//         JSON_AGG(DISTINCT service_type) AS service_type
//        FROM vendor`
//     );
//     res.status(200).json(new ApiResponse(200, "", rows[0]));
//   }
// );
