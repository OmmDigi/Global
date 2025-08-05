import { PoolClient } from "pg";
import { pool } from "../config/db";
import { ErrorHandler } from "../utils/ErrorHandler";

type IFillUpForm = {
  student_id: number;
  course_id: number;
  batch_id: number;
  session_id: number;
  fee_structure: { fee_head_id: number; amount: number, min_amount : number, required : boolean }[];
  admission_data?: string;
  client?: PoolClient;
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
     INSERT INTO fillup_forms (form_name, student_id)
     VALUES ($1 || nextval('${fillup_form_seq_constant_key}')::TEXT, $2)
     RETURNING form_name, id
    `,
    [customFormIdPrefix, data.student_id]
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
      (_, index) => `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`
    )
    .join(", ");
  await pgClient.query(
    `INSERT INTO form_fee_structure (form_id, fee_head_id, amount, min_amount, required) VALUES ${placeholder}`,
    data.fee_structure.flatMap((item) => [
      form_id,
      item.fee_head_id,
      item.amount,
      item.min_amount,
      item.required
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
