import { pool } from "../config/db";
import { ALLOWED_BATCH_FIELDS, ALLOWED_COURSE_FIELDS } from "../constant";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { generatePlaceholders } from "../utils/generatePlaceholders";
import {
  objectToSqlConverterUpdate,
  objectToSqlInsert,
} from "../utils/objectToSql";
import { parsePagination } from "../utils/parsePagination";
import {
  VCreateBatches,
  VCreateCourse,
  VCreateFeeHead,
  VCreateFeeStructure,
  VCreateSession,
  VGetFeeStructure,
  VGetSessionList,
  VSingleFeeStructure,
  VSingleSession,
  VUpdateCourse,
  VUpdateFeeHead,
  VUpdateFeeStructure,
  VUpdateSession,
} from "../validator/course.validator";

export const createSession = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateSession.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query("INSERT INTO session (name) VALUES ($1)", [value.name]);

  res
    .status(201)
    .json(new ApiResponse(201, "New session has successfully created"));
});

export const deleteSession = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleSession.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query("DELETE FROM session WHERE id = $1", [value.id]);

  res
    .status(200)
    .json(new ApiResponse(200, "Session has successfully removed"));
});

export const getSession = asyncErrorHandler(async (req, res) => {
  const { error, value } = VGetSessionList.validate(req.query ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const ALLOWED_FIELDS = new Map<string, boolean>();
  ALLOWED_FIELDS.set("id", true);
  ALLOWED_FIELDS.set("name", true);
  ALLOWED_FIELDS.set("is_active", true);
  ALLOWED_FIELDS.set("created_at", true);

  let columns = "id, name, is_active, created_at";

  if (value.fields) {
    const splitedFields = value.fields.split(",") as string[];
    //security checks
    for (const field of splitedFields) {
      if (!ALLOWED_FIELDS.has(field))
        throw new ErrorHandler(400, `${field} Is Not Allowed`);
    }
    columns = value.fields;
  }

  const { TO_STRING } = parsePagination(req);

  // filtes
  let filter = "";
  const filterValues: string[] = [];
  let pNum = 1;

  if (typeof value.is_active !== "undefined") {
    filter += `WHERE is_active = $${pNum}`;
    pNum++;
    filterValues.push(value.is_active);
  }

  const { rows } = await pool.query(
    `
      SELECT 
        ${columns} 
      FROM session 
      ${filter}
      ORDER BY id DESC 
      ${TO_STRING}`,
    filterValues
  );

  res.status(200).json(new ApiResponse(200, "Session List", rows));
});

export const updateSession = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdateSession.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const id_to_update = value.id;
  delete value.id;
  const { keys, paramsNum, values } = objectToSqlConverterUpdate(value);
  values.push(id_to_update);
  await pool.query(
    `UPDATE session SET ${keys} WHERE id = $${paramsNum}`,
    values
  );

  res.status(200).json(new ApiResponse(200, "Single session info updated"));
});

export const getSingleSession = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleSession.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const { rows, rowCount } = await pool.query(
    "SELECT * FROM session WHERE id = $1",
    [value.id]
  );

  if (rowCount === 0) throw new ErrorHandler(404, "Session not found");

  res.status(200).json(new ApiResponse(200, "Single Session", rows[0]));
});

// Fee Head
export const createFeeHead = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateFeeHead.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query("INSERT INTO course_fee_head (name) VALUES ($1)", [
    value.name,
  ]);

  res
    .status(201)
    .json(new ApiResponse(201, "Fee head has successfully created"));
});

export const updateFeeHead = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdateFeeHead.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const id = value.id;
  delete value.id;
  const { keys, paramsNum, values } = objectToSqlConverterUpdate(value);
  values.push(id);

  await pool.query(
    `UPDATE course_fee_head SET ${keys} WHERE id = $${paramsNum}`,
    values
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Fee head has successfully updated"));
});

export const getFeeHeadList = asyncErrorHandler(async (req, res) => {
  // filtes
  let filter = "";
  const filterValues: string[] = [];
  let pNum = 1;

  if (typeof req.query.is_active !== "undefined") {
    filter += `WHERE is_active = $${pNum}`;
    pNum++;
    filterValues.push(req.query.is_active.toString());
  }

  const { rows } = await pool.query(
    `SELECT * FROM course_fee_head ${filter} ORDER BY id DESC`,
    filterValues
  );
  res.status(200).json(new ApiResponse(200, "Fee head list", rows));
});

export const getSingleFeeHead = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleSession.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const { rows, rowCount } = await pool.query(
    "SELECT * FROM course_fee_head WHERE id = $1",
    [value.id]
  );
  if (rowCount === 0)
    throw new ErrorHandler(404, "No course fee head avilable");

  res
    .status(200)
    .json(new ApiResponse(200, "Single Course Fee Head Data", rows[0]));
});

// Fee Structure
// export const createFeeStructure = asyncErrorHandler(async (req, res) => {
//   const { error, value } = VCreateFeeStructure.validate(req.body ?? {});
//   if (error) throw new ErrorHandler(400, error.message);

//   await pool.query(
//     "INSERT INTO course_fee_structure (course_id, amount, fee_head_id) VALUES ($1, $2, $3)",
//     [value.course_id, value.amount, value.fee_head_id]
//   );

//   res
//     .status(201)
//     .json(new ApiResponse(201, "Fee structure has successfully created"));
// });

// export const updateFeeStructure = asyncErrorHandler(async (req, res) => {
//   const { error, value } = VUpdateFeeStructure.validate(req.body ?? {});
//   if (error) throw new ErrorHandler(400, error.message);

//   const id = value.id;
//   delete value.id;
//   const { keys, paramsNum, values } = objectToSqlConverterUpdate(value);
//   if(values.length === 0) throw new ErrorHandler(400, "Nothing to update")
//   values.push(id);

//   await pool.query(
//     `UPDATE course_fee_structure SET ${keys} WHERE id = $${paramsNum}`,
//     values
//   );

//   res
//     .status(200)
//     .json(new ApiResponse(200, "Fee structure has successfully updated"));
// });

// export const getFeeStructureList = asyncErrorHandler(async (req, res) => {
//   const { error, value } = VGetFeeStructure.validate(req.params ?? {});
//   if(error) throw new ErrorHandler(400, error.message);

//   const { rows } = await pool.query(
//     `
//     SELECT
//       cfs.id,
//       cfh.id as fee_head_id,
//       cfs.amount
//     FROM course_fee_structure cfs

//     LEFT JOIN course_fee_head cfh
//     ON cfs.fee_head_id = cfh.id

//     WHERE cfs.course_id = $1
//     `,
//     [value.course_id]
//   );
//   res.status(200).json(new ApiResponse(200, "Fee structures list", rows));
// });

// export const deleteFeeStructure = asyncErrorHandler(async (req, res) => {
//   const { error, value } = VSingleFeeStructure.validate(req.params ?? {});
//   if (error) throw new ErrorHandler(400, error.message);

//   await pool.query("DELETE FROM course_fee_structure WHERE id = $1", [value.id]);

//   res.status(200).json(new ApiResponse(200, "Fee structure removed"))
// });

// Course Controllers
export const createCourse = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateCourse.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error?.message);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      "INSERT INTO course (name, duration, description) VALUES ($1, $2, $3) RETURNING id",
      [value.name, value.duration, value.description]
    );

    const course_id = rows[0].id;

    await client.query(
      "DELETE FROM course_fee_structure WHERE course_id = $1",
      [course_id]
    );

    const fee_structure = value.fee_structure as {
      fee_head_id: number;
      amount: number;
      min_amount: number;
      required: boolean;
    }[];
    const placeholder = generatePlaceholders(fee_structure.length, 5);

    await client.query(
      `INSERT INTO course_fee_structure (course_id, fee_head_id, amount, min_amount, required) VALUES ${placeholder}`,
      fee_structure.flatMap((item) => [
        course_id,
        item.fee_head_id,
        item.amount,
        item.min_amount,
        item.required,
      ])
    );

    await client.query("COMMIT");

    res.status(201).json(new ApiResponse(201, "New course has created"));
  } catch (error: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, error.message);
  } finally {
    client.release();
  }
});

export const getCourseList = asyncErrorHandler(async (req, res) => {
  const { error, value } = VGetSessionList.validate(req.query ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const columns: string[] = [];

  const splitedFields = value.fields
    ? (value.fields.split(",") as string[])
    : ([] as string[]);
  if (splitedFields.length !== 0) {
    for (const field of splitedFields) {
      if (!ALLOWED_COURSE_FIELDS.has(field))
        throw new ErrorHandler(400, `${field} Is Not Allowed`);
      columns.push(ALLOWED_COURSE_FIELDS.get(field)?.toString() || "");
    }
  } else {
    ALLOWED_COURSE_FIELDS.forEach((v) => {
      columns.push(v);
    });
  }

  const { TO_STRING } = parsePagination(req);

  // filtes
  let filter = "";
  const filterValues: string[] = [];
  let pNum = 1;

  if (typeof value.is_active !== "undefined") {
    filter += `WHERE c.is_active = $${pNum}`;
    pNum++;
    filterValues.push(value.is_active);
  }

  const { rows } = await pool.query(
    `
      SELECT 
        ${columns.join(", ")}
      FROM course c

      LEFT JOIN course_fee_structure cfs
      ON cfs.course_id = c.id

      ${filter}

      GROUP BY c.id
      ORDER BY c.id DESC 
      ${TO_STRING}`,
    filterValues
  );

  res.status(200).json(new ApiResponse(200, "Course List", rows, []));
});

export const getSingleCourse = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleSession.validate({
    ...req.params,
    ...req.query,
  });
  if (error) throw new ErrorHandler(400, error.message);

  const columns: string[] = [];

  const splitedFields = value.fields
    ? (value.fields.split(",") as string[])
    : ([] as string[]);
  if (splitedFields.length !== 0) {
    for (const field of splitedFields) {
      if (!ALLOWED_COURSE_FIELDS.has(field))
        throw new ErrorHandler(400, `${field} Is Not Allowed`);
      columns.push(ALLOWED_COURSE_FIELDS.get(field)?.toString() || "");
    }
  } else {
    ALLOWED_COURSE_FIELDS.forEach((v) => {
      columns.push(v);
    });
  }

  const { rows, rowCount } = await pool.query(
    `SELECT 
      ${columns.join(", ")} 
     FROM course c

     LEFT JOIN course_fee_structure cfs
     ON cfs.course_id = c.id

     WHERE c.id = $1
     
     GROUP BY c.id`,
    [value.id]
  );
  if (rowCount === 0)
    throw new ErrorHandler(400, "No course avilable with this id");

  res.status(200).json(new ApiResponse(200, "Single Course", rows[0]));
});

export const deleteSingleCourse = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleSession.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query("DELETE FROM course WHERE id = $1", [value.id]);

  res.status(200).json(new ApiResponse(200, "Course Successfully Removed"));
});

export const updateCourse = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdateCourse.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const fee_structure =
      (value?.fee_structure as {
        fee_head_id: number;
        amount: number;
        min_amount: number;
        required: boolean;
      }[]) ?? [];

    const course_id = value.id;
    delete value.id;
    delete value.fee_structure;
    const { keys, paramsNum, values } = objectToSqlConverterUpdate(value);
    values.push(course_id);

    await pool.query(
      `UPDATE course SET ${keys} WHERE id = $${paramsNum}`,
      values
    );

    if (fee_structure.length !== 0) {
      await client.query(
        "DELETE FROM course_fee_structure WHERE course_id = $1",
        [course_id]
      );

      const placeholder = generatePlaceholders(fee_structure.length, 5);

      await client.query(
        `INSERT INTO course_fee_structure (course_id, fee_head_id, amount, min_amount, required) VALUES ${placeholder}`,
        fee_structure.flatMap((item) => [
          course_id,
          item.fee_head_id,
          item.amount,
          item.min_amount,
          item.required,
        ])
      );
    }

    await client.query("COMMIT");

    res.status(200).json(new ApiResponse(200, "Course Info Updated"));
  } catch (error: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, error.message);
  } finally {
    client.release();
  }
});

export const getCourseWithBatchSession = asyncErrorHandler(async (req, res) => {
  const { rows } = await pool.query(
    `
     SELECT 
      c.id,
      c.name AS course_name,
      (SELECT MAX(amount) FROM course_fee_structure WHERE course_id = c.id AND fee_head_id = 3) AS admission_fee,
	    (SELECT MAX(amount) FROM course_fee_structure WHERE course_id = c.id AND fee_head_id = 6) AS bss_fee,
      -- Deduplicated sessions
      COALESCE(
        (
          SELECT JSON_AGG(JSON_BUILD_OBJECT('session_id', session_id, 'session_name', session_name))
          FROM (
            SELECT DISTINCT s.id AS session_id, s.name AS session_name
            FROM batch b2
            LEFT JOIN session s ON b2.session_id = s.id
            WHERE b2.course_id = c.id AND s.is_active = true AND s.id IS NOT NULL
          ) AS unique_sessions
        ),
        '[]'::json
      ) AS session,

      -- Deduplicated batches
      COALESCE(
        (
          SELECT JSON_AGG(JSON_BUILD_OBJECT('batch_id', batch_id, 'session_id', session_id, 'month_name', month_name))
          FROM (
            SELECT DISTINCT b3.id AS batch_id, b3.month_name, b3.session_id
            FROM batch b3
            WHERE b3.course_id = c.id AND b3.is_active = true AND b3.id IS NOT NULL
          ) AS unique_batches
        ),
        '[]'::json
      ) AS batch

    FROM course c
    
    WHERE c.is_active = true
    `
  );

  res.status(200).json(new ApiResponse(200, "Course Info For DropDown", rows));
});

// batch controllers
export const createBatch = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateBatches.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const months = value.month_names as number[];

  const placeholder = months
    .map(
      (_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
    )
    .join(", ");

  await pool.query(
    `INSERT INTO batch (course_id, session_id, month_name) VALUES ${placeholder}`,
    months.flatMap((month) => [value.course_id, value.session_id, month])
  );

  res
    .status(201)
    .json(new ApiResponse(201, "New Batch has successfully created"));
});

export const deleteBatch = asyncErrorHandler(async (req, res) => {
  const { error, value } = VSingleSession.validate(req.params ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  await pool.query("DELETE FROM batch WHERE id = $1", [value.id]);

  res.status(200).json(new ApiResponse(200, "Batch has successfully removed"));
});

export const getBatch = asyncErrorHandler(async (req, res) => {
  const { error, value } = VGetSessionList.validate(req.query ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const columns: string[] = [];

  const splitedFields = value.fields
    ? (value.fields.split(",") as string[])
    : ([] as string[]);
  if (splitedFields.length !== 0) {
    for (const field of splitedFields) {
      if (!ALLOWED_BATCH_FIELDS.has(field))
        throw new ErrorHandler(400, `${field} Is Not Allowed`);
      columns.push(ALLOWED_BATCH_FIELDS.get(field)?.toString() || "");
    }
  } else {
    ALLOWED_BATCH_FIELDS.forEach((v) => {
      columns.push(v);
    });
  }

  const { TO_STRING } = parsePagination(req);

  // filtes
  let filter = "";
  const filterValues: string[] = [];
  let pNum = 1;

  if (typeof value.is_active !== "undefined") {
    filter += `WHERE b.is_active = $${pNum}`;
    pNum++;
    filterValues.push(value.is_active);
  }

  const { rows } = await pool.query(
    `
      SELECT 
        ${columns.join(", ")} 
      FROM batch b

      LEFT JOIN course c
      ON c.id = b.course_id

      LEFT JOIN session s
      ON s.id = b.session_id

      ${filter}
      ORDER BY id DESC 
      ${TO_STRING}`,
    filterValues
  );

  res.status(200).json(new ApiResponse(200, "Batch List", rows));
});

export const updateBatch = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdateSession.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const id_to_update = value.id;
  delete value.id;
  const { keys, paramsNum, values } = objectToSqlConverterUpdate(value);
  values.push(id_to_update);
  await pool.query(`UPDATE batch SET ${keys} WHERE id = $${paramsNum}`, values);

  res.status(200).json(new ApiResponse(200, "Batch status updated"));
});

// export const getSingleBatch = asyncErrorHandler(async (req, res) => {
//   const { error, value } = VSingleSession.validate(req.params ?? {});
//   if (error) throw new ErrorHandler(400, error.message);

//   const { rows, rowCount } = await pool.query(
//     "SELECT * FROM batch WHERE course_id = $1",
//     [value.id]
//   );

//   if (rowCount === 0) throw new ErrorHandler(404, "Batch not found");

//   res.status(200).json(new ApiResponse(200, "Single batch", rows[0]));
// });
