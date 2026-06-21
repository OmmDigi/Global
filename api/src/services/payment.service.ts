import { PoolClient } from "pg";
import { pool } from "../config/db";
import { generatePlaceholders } from "../utils/generatePlaceholders";
import { ErrorHandler } from "../utils/ErrorHandler";
import { LATE_FINE_FEE_HEAD_ID, MONTHS } from "../constant";

type IPaymentProps = {
  form_id: number;
  student_id: number;
  order_id?: string;
  mode: string | null;
  transition_id?: string;
  payment_details: string | null; // remark
  status: 1 | 2 | 3;
  fee_head_ids_info: {
    fee_head_id: number;
    amount: number;
    payment_date: string | null;
    month: string | null;
    bill_no: string | null;
    payment_mode: string | null;
    payment_details: string | null;
  }[];
  client?: PoolClient;
};
export const setPayment = async (data: IPaymentProps) => {
  const pgClient = data.client ?? pool;

  const date = new Date();
  const next_receipt_sr_number = await pgClient.query(
    "SELECT nextval('receipt_no_seq') AS receipt_no",
  );
  const SEQ = next_receipt_sr_number.rows[0].receipt_no;
  const receipt_id = `GTI/${date.getFullYear()}/${SEQ}`;

  const placeholder = data.fee_head_ids_info
    .map(
      (_, index) =>
        `($${index * 14 + 1}, $${index * 14 + 2}, $${index * 14 + 3}, $${
          index * 14 + 4
        }, $${index * 14 + 5}, $${index * 14 + 6}, $${index * 14 + 7}, $${
          index * 14 + 8
        }, $${index * 14 + 9}, $${index * 14 + 10}, $${index * 14 + 11}, $${
          index * 14 + 12
        }, $${index * 14 + 13}, $${index * 14 + 14})`,
    )
    .join(", ");

  await pgClient.query(
    `INSERT INTO payments (form_id, mode, student_id, payment_name_id, order_id, receipt_id, amount, fee_head_id, status, transition_id, remark, payment_date, month, bill_no) VALUES ${placeholder}`,
    data.fee_head_ids_info.flatMap((fee_head_info) => {
      return [
        data.form_id,
        fee_head_info.payment_mode ?? data.mode,
        data.student_id,
        date.getTime(),
        data.order_id,
        receipt_id,
        fee_head_info.amount,
        fee_head_info.fee_head_id,
        data.status,
        data.transition_id,
        fee_head_info.payment_details ?? data.payment_details,
        fee_head_info.payment_date ?? new Date(),
        fee_head_info.month,
        fee_head_info.bill_no,
      ];
    }),
  );

  return {
    receipt_id,
  };
};

interface IDeletePaymentProps {
  ids: (number | null)[];
  form_id: number;
  user_id: number;
  client: PoolClient;
}
export const deletePaymentService = async (value: IDeletePaymentProps) => {
  const client = value.client;

  let placeholder = "";
  let placeholdernum = 1;
  const valueToStore: any[] = [];

  for (const id of value.ids) {
    if (id !== null) {
      if (placeholder === "") {
        placeholder += `$${placeholdernum}`;
      } else {
        placeholder += `, $${placeholdernum}`;
      }
      valueToStore.push(id);
      placeholdernum++;
    }
  }

  valueToStore.push(value.form_id);

  const { rows, rowCount } = await client.query(
    `DELETE FROM payments WHERE id IN (${placeholder}) AND form_id = $${placeholdernum} RETURNING *`,
    valueToStore,
  );

  if (rowCount === 0) {
    return { success: false, message: "No admission form found" };
  }

  const insertPlaceholder = generatePlaceholders(rows.length, 4);

  await client.query(
    `INSERT INTO deleted_payments (payment_row_id, payment_info, form_id, user_id) VALUES ${insertPlaceholder}`,
    rows.flatMap((item) => {
      const paymentInfoJson = JSON.stringify(item);
      return [item.id, paymentInfoJson, item.form_id, value.user_id];
    }),
  );

  return true;
};

export const checkLateFineService = async (
  payMonths: string[],
  form_id: number,
): Promise<{
  amount: number;
  fineAmount: number;
  lateFineMonths : string[]
}> => {
  // payMonths: array of "YYYY-MM" strings

  const [formFeeStructure, lateFineConfig] = await Promise.all([
    pool.query(
      "SELECT 1 FROM form_fee_structure WHERE form_id = $1 AND fee_head_id = $2",
      [form_id, LATE_FINE_FEE_HEAD_ID],
    ),
    pool.query("SELECT * FROM late_fine_config LIMIT 1"),
  ]);

  if (formFeeStructure.rowCount == 0) {
    return {
      amount: 0,
      fineAmount: lateFineConfig.rows[0].amount,
      lateFineMonths : []
    };
  }

  if (lateFineConfig.rowCount == 0) {
    throw new ErrorHandler(
      500,
      "No late fine config set. please try again after some time",
    );
  }

  const config = lateFineConfig.rows[0];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentAbsMonth = currentYear * 12 + currentMonth;

  let totalFine = 0;
  let lateFineMonths : string[] = [];
  for (const payMonthTxt of payMonths) {
    const d = new Date(payMonthTxt);
    const payMonth = d.getMonth() + 1;
    const payYear = d.getFullYear();
    const payAbsMonth = payYear * 12 + payMonth;

    if (payAbsMonth < currentAbsMonth) {
      // Past month → fine unless exempt
      // console.log("config.applicable_months", config.applicable_months);
      // console.log("MONTHS[payMonth - 1]", MONTHS[payMonth - 1]);
      // console.log(config.applicable_months.includes(MONTHS[payMonth - 1]));
      if (config.applicable_months.includes(MONTHS[payMonth - 1])) {
        totalFine += Number(config.amount);
        lateFineMonths.push(MONTHS[payMonth - 1])
      }
    } else if (payAbsMonth === currentAbsMonth) {
      // Current month → fine only if past fine_date
      if (now.getDate() > config.fine_date) {
        totalFine += Number(config.amount);
        lateFineMonths.push(MONTHS[payMonth - 1])
      }
    }
    // Future month → no fine
  }

  return { amount: totalFine, fineAmount: Number(config.amount), lateFineMonths : lateFineMonths };
};
