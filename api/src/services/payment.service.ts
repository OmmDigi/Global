import { PoolClient } from "pg";
import { pool } from "../config/db";

type IPaymentProps = {
  form_id: number;
  student_id: number;
  order_id: string;
  mode: string;
  fee_head_ids_info: { fee_head_id: number; amount: number }[];
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
        `($${index * 8 + 1}, $${index * 8 + 2}, $${index * 8 + 3}, $${
          index * 8 + 4
        }, $${index * 8 + 5}, $${index * 8 + 6}, $${index * 8 + 7}, $${index * 8 + 8})`
    )
    .join(", ");
  await pgClient.query(
    `INSERT INTO payments (form_id, mode, student_id, payment_name_id, order_id, receipt_id, amount, fee_head_id) VALUES ${placeholder}`,
    data.fee_head_ids_info.flatMap((fee_head_info) => [
      data.form_id,
      data.mode,
      data.student_id,
      date.getTime(),
      data.order_id,
      receipt_id,
      fee_head_info.amount,
      fee_head_info.fee_head_id,
    ])
  );

  return {
    receipt_id,
  };
};