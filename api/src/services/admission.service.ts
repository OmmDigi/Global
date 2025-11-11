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
  admissionDate:string | null
  client?: PoolClient;
  declaration_status?: number;
};

export const doAdmission = async (data: IFillUpForm) => {
  if (data.fee_structure.length === 0)
    throw new ErrorHandler(400, "Please add some Fee Structure of this course");

  const pgClient = data.client ?? pool;

  const date = new Date();
  const ADMISSION_DATE_TO_STORE = data.admissionDate === "" || data.admissionDate == null ? date.toISOString().split('T')[0] : data.admissionDate; //YYYY-MM-DD

  const customFormIdPrefix = `GTI/FORM/${date.getFullYear()}/`;
  const fillup_form_seq_constant_key = "fillup_form_seq";

  const { rows } = await pgClient.query(
    `
     INSERT INTO fillup_forms (form_name, student_id, admission_date ${
       data.declaration_status !== undefined ? ",declaration_status" : ""
     })
     VALUES ($1 || nextval('${fillup_form_seq_constant_key}')::TEXT, $2, TO_CHAR($3::date, 'YYYY-MM-DD')::date ${
      data.declaration_status !== undefined ? ",$4" : ""
    })
     RETURNING form_name, id
    `,
    data.declaration_status !== undefined
      ? [customFormIdPrefix, data.student_id, ADMISSION_DATE_TO_STORE, data.declaration_status]
      : [customFormIdPrefix, data.student_id, ADMISSION_DATE_TO_STORE]
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
        `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${
          index * 5 + 4
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
    filter = `WHERE ff.student_id = $${placeholder++} AND ff.status = 2`;
    filterValues.push(value.student_id || student_id);
  }

  // if (value.from_date && value.to_date) {
  //   if (filter == "") {
  //     filter = `WHERE ff.created_at BETWEEN $${placeholder++}::date AND $${placeholder++}::date`;
  //   } else {
  //     filter += ` AND ff.created_at BETWEEN $${placeholder++}::date AND $${placeholder++}::date`;
  //   }
  //   filterValues.push(value.from_date)
  //   filterValues.push(value.to_date)
  // }

  if (value.course) {
    if (filter == "") {
      filter = `WHERE ec.course_id = $${placeholder++}`;
    } else {
      filter += ` AND ec.course_id = $${placeholder++}`;
    }
    filterValues.push(value.course);
  }

  if (value.batch) {
    if (filter == "") {
      filter = `WHERE ec.batch_id = $${placeholder++}`;
    } else {
      filter += ` AND ec.batch_id = $${placeholder++}`;
    }
    filterValues.push(value.batch);
  }

  if (value.session) {
    if (filter === "") {
      filter = `WHERE ec.session_id = $${placeholder++}`;
    } else {
      filter += ` AND ec.session_id = $${placeholder++}`;
    }

    filterValues.push(value.session);
  }

  if (value.form_no) {
    if(filter === "") {
      filter = `WHERE ff.form_name = $${placeholder++}`;
    } else {
      filter += ` AND ff.form_name = $${placeholder++}`;
    }
    filterValues.push(value.form_no);
  }

  if (value.ph_no) {
    if(filter === "") {
      filter = `WHERE u.ph_no = $${placeholder++}`;
    } else {
      filter += ` AND u.ph_no = $${placeholder++}`;
    }
    filterValues.push(value.ph_no);
  }

  if (value.name) {
    if(filter === "") {
      filter = `WHERE u.name = $${placeholder++}`;
    } else {
      filter += ` AND u.name = $${placeholder++}`;
    }
    filterValues.push(value.name);
  }

  if (value.email) {
    if(filter === "") {
      filter = `WHERE u.email = $${placeholder++}`;
    } else {
      filter += ` AND u.email = $${placeholder++}`;
    }
    filterValues.push(value.email);
  }

  let feeHeadIdFilter = "";
  if(value.fee_head_id) {
    feeHeadIdFilter += `AND fee_head_id = $${placeholder++}`;
    filterValues.push(value.fee_head_id);
  }

  const query = `
      SELECT
        ff.id AS form_id,
        ff.form_name,
        u.name AS student_name,
        u.image AS student_image,
        c.name AS course_name,
        
        (
          COALESCE((SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id ${feeHeadIdFilter}), 0.00) - 
          COALESCE((SELECT SUM(amount) FROM payments WHERE form_id = ff.id AND mode = 'Discount' AND status = 2 ${feeHeadIdFilter}), 0.00)
        ) AS course_fee,

        COALESCE((SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id ${feeHeadIdFilter}), 0.00) - COALESCE((SELECT SUM(amount) FROM payments WHERE form_id = ff.id AND status = 2 ${feeHeadIdFilter}), 0.00) AS due_amount,
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
  `;

  return await pool.query(query, filterValues);
};

export const getSingleAdmissionData = async (
  form_id: number,
  student_id?: number,
  request_user_id?: number,
  fee_head_id?:number
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let basicQueryFilter = "WHERE ff.id = $1";
    let basicQueryFilterPlaceNum = 2;
    const basicQueryFilterValues : any[] = [form_id];

    if(student_id) {
      basicQueryFilter += ` AND ff.student_id = $${basicQueryFilterPlaceNum++} AND ff.status = 2`;
      basicQueryFilterValues.push(student_id);
    }

    let feeHeadIdFilter = "";
    if(fee_head_id) {
      feeHeadIdFilter += ` AND fee_head_id = $${basicQueryFilterPlaceNum++}`;
      basicQueryFilterValues.push(fee_head_id);
    }
    
    const { rows: basicInfo } = await client.query(
      `
         SELECT
            ff.id AS form_id,
            ff.form_name,
            u.name AS student_name,
            u.email,
            u.ph_no,
            ff.declaration_status,
            u.image AS student_image,
            c.name AS course_name,
            (c.duration || ' ' || c.duration_name) AS duration,
            b.month_name AS batch_name,
            s.name AS session_name,
            COALESCE((SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id ${feeHeadIdFilter}), 0.00) AS course_fee,
            COALESCE((SELECT SUM(amount) FROM form_fee_structure WHERE form_id = ff.id ${feeHeadIdFilter}), 0.00) - COALESCE((SELECT SUM(amount) FROM payments WHERE form_id = ff.id AND status = 2 ${feeHeadIdFilter}), 0.00) AS due_amount,
            COALESCE((SELECT SUM(amount) FROM payments WHERE form_id = ff.id AND status = 2 AND mode = 'Discount' ${feeHeadIdFilter}), 0.00) AS total_discount
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
  
          ${basicQueryFilter}
        `,
      basicQueryFilterValues
    );

    let feeStructureInfoFilter = "WHERE ffs.form_id = $1";
    let feeStructureInfoFilterNum = 2;
    const feeStrucInfoFilterValues : any[] = [form_id];

    if(fee_head_id) {
      feeStructureInfoFilter += ` AND ffs.fee_head_id = $${feeStructureInfoFilterNum++}`
      feeStrucInfoFilterValues.push(fee_head_id)
    }

    const { rows: feeStructureInfo } = await client.query(
      `
          SELECT
            cfh.name AS fee_head_name,
            cfh.id AS fee_head_id,
            COALESCE(ffs.min_amount, 0.00) AS min_amount,
            COALESCE(ffs.amount, 0.00) - COALESCE(SUM(p.amount) FILTER (WHERE p.mode = 'Discount'), 0.00) AS price,
            COALESCE(ffs.amount, 0.00) - COALESCE(SUM(p.amount), 0.00) AS due_amount
          FROM form_fee_structure ffs
  
          LEFT JOIN course_fee_head cfh
          ON cfh.id = ffs.fee_head_id

          LEFT JOIN fillup_forms ff
          ON ff.id = ffs.form_id
  
          LEFT JOIN payments p
          ON p.form_id = $1 AND cfh.id = p.fee_head_id AND p.status = 2

          ${feeStructureInfoFilter}
  
          GROUP BY cfh.id, ffs.id

          ORDER BY cfh.position
        `,
      feeStrucInfoFilterValues
    );


    let paymentListFilter = "WHERE p.form_id = $2 AND p.status = 2";
    let paymentListPlaceholerNum = 3;
    let paymentListValues : any[] = [request_user_id, form_id];

    if(fee_head_id) {
      paymentListFilter += ` AND p.fee_head_id = $${paymentListPlaceholerNum++}`;
      paymentListValues.push(fee_head_id)
    }

    const { rows: admissionFormPayments } = await client.query(
      `
        SELECT
          cfh.name AS fee_head_name,
          p.*,
          TO_CHAR(p.payment_date, 'FMDD FMMonth, YYYY') AS payment_date,
          TO_CHAR(p.month, 'FMMonth, YYYY') AS month,
          p.amount
          -- CASE
          --  WHEN p.mode = 'Cash' AND (u.category != 'Admin' AND u.category != 'Student') THEN -1
          --  ELSE p.amount
          -- END AS amount
        FROM payments p
  
        LEFT JOIN course_fee_head cfh
        ON cfh.id = p.fee_head_id

        LEFT JOIN fillup_forms ff
        ON ff.id = p.form_id

        LEFT JOIN users u
        ON u.id = $1

        ${paymentListFilter}
          
        ORDER BY cfh.position
      `,
      paymentListValues
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
