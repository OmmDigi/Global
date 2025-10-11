import { PoolClient } from "pg";
import { pool } from "../config/db";

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
    bill_no : string | null;
    payment_mode : string | null
  }[];
  client?: PoolClient;
};
export const setPayment = async (data: IPaymentProps) => {
  const pgClient = data.client ?? pool;

  const date = new Date();
  const next_receipt_sr_number = await pgClient.query(
    "SELECT nextval('receipt_no_seq') AS receipt_no"
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
        }, $${index * 14 + 13}, $${index * 14 + 14})`
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
      data.payment_details,
      fee_head_info.payment_date ?? new Date(),
      fee_head_info.month,
      fee_head_info.bill_no
    ]
    })
  );

  return {
    receipt_id,
  };
};
