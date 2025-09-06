import { PoolClient } from "pg";
import { pool } from "../config/db";
import { ErrorHandler } from "../utils/ErrorHandler";
import { parsePagination } from "../utils/parsePagination";
import { Request } from "express";
import { VGetAdmissionList } from "../validator/admission.validator";

type IFillUpForm = {
  student_id: number;
  course_id: number;
  batch_id: number;
  session_id: number;
  fee_structure: {
    fee_head_id: number;
    amount: number;
    min_amount: number;
    required: boolean;
  }[];
  admission_data?: string;
  client?: PoolClient;
  declaration_status?: number
};

export const doAdmission = async (data: IFillUpForm) => {
  if (data.fee_structure.length === 0)
    throw new ErrorHandler(400, "Please add some Fee Structure of this course");

  const pgClient = data.client ?? pool;

  const date = new Date();

  const customFormIdPrefix = `GTI/FORM/${date.getFullYear()}/`;
  const fillup_form_seq_constant_key = "fillup_form_seq";

  const { rows } = await pgClient.query(
    `
     INSERT INTO fillup_forms (form_name, student_id, declaration_status)
     VALUES ($1 || nextval('${fillup_form_seq_constant_key}')::TEXT, $2 ${data.declaration_status !== undefined ? ",$3" : ""})
     RETURNING form_name, id
    `,
    data.declaration_status !== undefined ? [customFormIdPrefix, data.student_id, data.declaration_status] : [customFormIdPrefix, data.student_id]
  );

  const form_name = rows[0].form_name as string;
  const form_id = rows[0].id as number;

  await pgClient.query(
    `
     INSERT INTO enrolled_courses (form_id, course_id, batch_id, session_id) VALUES ($1, $2, $3, $4)
    `,
    [form_id, data.course_id, data.batch_id, data.session_id]
  );

  const placeholder = data.fee_structure
    .map(
      (_, index) =>
        `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4
        }, $${index * 5 + 5})`
    )
    .join(", ");
  await pgClient.query(
    `INSERT INTO form_fee_structure (form_id, fee_head_id, amount, min_amount, required) VALUES ${placeholder}`,
    data.fee_structure.flatMap((item) => [
      form_id,
      item.fee_head_id,
      item.amount,
      item.min_amount,
      item.required,
    ])
  );

  if (data.admission_data) {
    await pgClient.query(
      `
       INSERT INTO admission_data (form_id, student_id, admission_details) VALUES ($1, $2, $3)
      `,
      [form_id, data.student_id, data.admission_data]
    );
  }

  return {
    form_name,
    form_id,
  };
};

export const getAdmissions = async (req: Request, student_id?: number) => {
  const { TO_STRING } = parsePagination(req);

  const { error, value } = VGetAdmissionList.validate(req.query);
  if (error) throw new ErrorHandler(400, error.message);

  let filter = "";
  const filterValues: string[] = [];
  let placeholder = 1;

  if (value.student_id || student_id) {
    filter = `WHERE ff.student_id = $${placeholder++}`;
    filterValues.push(value.student_id || student_id);
  }

  if (value.from_date && value.to_date) {
    if (filter == "") {
      filter = `WHERE ff.created_at BETWEEN $${placeholder++}::date AND $${placeholder++}::date`;
    } else {
      filter += ` AND ff.created_at BETWEEN $${placeholder++}::date AND $${placeholder++}::date`;
    }
    filterValues.push(value.from_date)
    filterValues.push(value.to_date)
  }

  if (value.course) {
    if (filter == "") {
      filter = `WHERE c.id = $${placeholder++}`;
    } else {
      filter += ` AND c.id = $${placeholder++}`;
    }
    filterValues.push(value.course)
  }

  if (value.batch) {
    if (filter == "") {
      filter = `WHERE b.id = $${placeholder++}`;
    } else {
      filter += ` AND b.id = $${placeholder++}`;
    }
    filterValues.push(value.batch)
  }

  if (value.form_no) {
    filter = `WHERE ff.form_name = $${placeholder++}`;
    filterValues.push(value.form_no)
  }

  return await pool.query(
    `
      SELECT
        ff.id AS form_id,
        ff.form_name,
        u.name AS student_name,
        u.image AS student_image,
        c.name AS course_name,
        (SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id) AS course_fee,
        COALESCE((SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id), 0.00) - COALESCE((SELECT SUM(amount) FROM payments WHERE form_id = ff.id AND status = 2), 0.00) AS due_amount,
        b.month_name AS batch_name,
        CASE WHEN ff.status = 2 THEN true ELSE false END AS form_status
        -- JSON_AGG(JSON_BUILD_OBJECT('batch_id', b.id, 'batch_name', b.month_name)) AS batches
      FROM fillup_forms ff
  
      LEFT JOIN users u
      ON u.id = ff.student_id
  
      LEFT JOIN enrolled_courses ec
      ON ec.form_id = ff.id
  
      LEFT JOIN batch b
      ON b.id = ec.batch_id
  
      LEFT JOIN course c
      ON c.id = ec.course_id

     ${filter}
  
      GROUP BY ff.id, u.id, c.id, b.id
      ORDER BY ff.id DESC
      ${TO_STRING}
      `,
    filterValues
  );
};

export const getSingleAdmissionData = async (
  form_id: number,
  student_id?: number
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const { rows: basicInfo } = await client.query(
      `
         SELECT
            ff.id AS form_id,
            ff.form_name,
            u.name AS student_name,
            ff.declaration_status,
            u.image AS student_image,
            c.name AS course_name,
            b.month_name AS batch_name,
            s.name AS session_name,
            COALESCE((SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id), 0.00) AS course_fee,
            COALESCE((SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id), 0.00) - COALESCE((SELECT SUM(amount) FROM payments WHERE form_id = ff.id AND status = 2), 0.00) AS due_amount
          FROM fillup_forms ff
  
          LEFT JOIN users u
          ON u.id = ff.student_id
  
          LEFT JOIN enrolled_courses ec
          ON ec.form_id = $1
  
          LEFT JOIN course c
          ON c.id = ec.course_id
  
          LEFT JOIN batch b
          ON b.id = ec.batch_id
  
          LEFT JOIN session s
          ON s.id = ec.session_id
  
          WHERE ff.id = $1 ${student_id ? " AND ff.student_id = $2" : ""}
        `,
      student_id ? [form_id, student_id] : [form_id]
    );
    const { rows: feeStructureInfo } = await client.query(
      `
          SELECT
            cfh.name AS fee_head_name,
            cfh.id AS fee_head_id,
            COALESCE(ffs.min_amount, 0.00) AS min_amount,
            COALESCE(ffs.amount, 0.00) AS price,
            COALESCE(ffs.amount, 0.00) - COALESCE(SUM(p.amount), 0.00) AS due_amount
          FROM form_fee_structure ffs
  
          LEFT JOIN course_fee_head cfh
          ON cfh.id = ffs.fee_head_id
  
          LEFT JOIN payments p
          ON p.form_id = $1 AND cfh.id = p.fee_head_id AND p.status = 2
  
          WHERE ffs.form_id = $1
  
          GROUP BY cfh.id, ffs.id
        `,
      [form_id]
    );
    const { rows: admissionFormPayments } = await client.query(
      `
          SELECT
            cfh.name AS fee_head_name,
            p.*
          FROM payments p
  
          LEFT JOIN course_fee_head cfh
          ON cfh.id = p.fee_head_id
  
          WHERE p.form_id = $1 AND p.status = 2
  
          ORDER BY p.id DESC
        `,
      [form_id]
    );
    await client.query("COMMIT");

    return {
      ...basicInfo[0],
      fee_structure_info: feeStructureInfo,
      payments_history: admissionFormPayments,
    };
  } catch (error: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, error.message);
  } finally {
    client.release();
  }
};
