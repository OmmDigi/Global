import { pool } from "../config/db";
import { ALLOWED_BATCH_FIELDS, ALLOWED_COURSE_FIELDS } from "../constant";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import {
  objectToSqlConverterUpdate,
  objectToSqlInsert,
} from "../utils/objectToSql";
import { parsePagination } from "../utils/parsePagination";
import {
  VCreateBatches,
  VCreateCourse,
  VCreateSession,
  VGetSessionList,
  VSingleSession,
  VUpdateCourse,
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

// Course Controllers
export const createCourse = asyncErrorHandler(async (req, res) => {
  const { error, value } = await VCreateCourse.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error?.message);

  const { columns, params, values } = objectToSqlInsert(value);

  await pool.query(`INSERT INTO course ${columns} VALUES ${params}`, values);

  res.status(201).json(new ApiResponse(201, "New course has created"));
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

      LEFT JOIN session s
      ON s.id = c.session_id

      ${filter}
      ORDER BY id DESC 
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

     LEFT JOIN session s
     ON s.id = c.session_id

     WHERE c.id =  $1`,
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

  const id_to_update = value.id;
  delete value.id;
  const { keys, paramsNum, values } = objectToSqlConverterUpdate(value);
  values.push(id_to_update);

  await pool.query(
    `
     UPDATE course SET ${keys} WHERE id = $${paramsNum}
    `,
    values
  );
  res.status(200).json(new ApiResponse(200, "Course Info Updated"));
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
