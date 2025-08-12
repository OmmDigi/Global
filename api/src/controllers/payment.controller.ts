import { pool } from "../config/db";
import { phonePe } from "../config/phonePe";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { setPayment } from "../services/payment.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import {
  VAddPayment,
  VCreateOrderValidator,
} from "../validator/payment.validator";

import { v4 as uuidv4 } from "uuid";

export const createOrder = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateOrderValidator.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const merchant_order_id = uuidv4();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const fee_structure_info = value.fee_structure_info as {
      fee_head_id: number;
      custom_min_amount: number;
    }[];
    const placeholder = fee_structure_info
      .map((_, index) => `$${index + 2}`)
      .join(", ");

    const { rows, rowCount } = await client.query(
      `
      SELECT 
        ffs.fee_head_id,
        ffs.amount,
        ffs.min_amount,
        ffs.required,
        ff.form_name,
        u.id AS student_id,
        u.name AS student_name,
        u.ph_no AS student_ph_number
      FROM form_fee_structure ffs

      LEFT JOIN fillup_forms ff
      ON ffs.form_id = ff.id

      LEFT JOIN users u
      ON ff.student_id = u.id

      WHERE ffs.form_id = $1 AND ffs.fee_head_id IN (${placeholder})
      `,
      [
        value.form_id,
        ...fee_structure_info.flatMap((item) => [item.fee_head_id]),
      ]
    );

    if (rowCount === 0) throw new ErrorHandler(400, "No admission form found");

    const student_id = rows[0].student_id;
    const student_name = rows[0].student_name;
    const student_ph_number = rows[0].student_ph_number;

    let amountToPaid = 0;
    const fee_head_ids_info: {
      fee_head_id: number;
      amount: number;
    }[] = [];

    rows.forEach((item) => {
      const db_min_amount = parseFloat(item.min_amount);
      const custom_amount =
        fee_structure_info.find((fs) => fs.fee_head_id == item.fee_head_id)
          ?.custom_min_amount ?? 0;

      if (custom_amount >= db_min_amount) {
        amountToPaid += custom_amount;
      } else {
        amountToPaid += db_min_amount;
      }

      fee_head_ids_info.push({
        fee_head_id: item.fee_head_id,
        amount: custom_amount,
      });
    });

    const { success, data } = await phonePe().createOrder({
      merchantUserId: student_name,
      mobileNumber: student_ph_number,
      amount: amountToPaid * 100,
      merchantTransactionId: merchant_order_id,
      redirectUrl: `${process.env.API_HOST_URL}/api/v1/payment/verify?merchant_order_id=${merchant_order_id}`,
      redirectMode: "GET",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    });

    if (!success) {
      throw new ErrorHandler(400, "Unable to create order");
    }

    // create a payment table with payment
    await setPayment({
      form_id: value.form_id,
      mode: "Online",
      order_id: merchant_order_id,
      student_id: student_id,
      fee_head_ids_info: fee_head_ids_info,
      client: client,
    });

    await client.query("COMMIT");

    res.status(201).json(
      new ApiResponse(201, "Order created", {
        payment_page_url: data.instrumentResponse.redirectInfo.url,
      })
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.log(error);
    throw new ErrorHandler(400, error.message);
  } finally {
    client.release();
  }
});

export const verifyPayment = asyncErrorHandler(async (req, res) => {
  const response = await phonePe().checkStatus(
    req.query.merchant_order_id?.toString() ?? ""
  );

  // after verify add transactionId as payment_name_id and change the status of the payment table
  const payment_status: any = {
    PENDING: 1,
    COMPLETED: 2,
    FAILED: 3,
  };

  await pool.query(
    "UPDATE payments SET payment_name_id = $1, status = $2, transition_id = $3, order_id = $4 WHERE order_id = $5",
    [
      response.data.transactionId,
      payment_status[response.data.state],
      response.data.transactionId,
      response.data.orderId,
      req.query.merchant_order_id,
    ]
  );

  if (!response.success) throw new ErrorHandler(400, response.message);

  res.status(200).json(new ApiResponse(200, "Payment Done"));
});

// this is from admin panel only
export const addPayment = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddPayment.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const client_fee_structure_info = (value.fee_structure_info as {
    fee_head_id: number;
    custom_min_amount: number;
  }[]).filter(item => item.custom_min_amount != 0);

  if(client_fee_structure_info.length === 0) throw new ErrorHandler(400, "No Payment Amount To Add")

  // const { rows } = await pool.query(
  //   `
  //     SELECT
  //       p.fee_head_id,
  //       p.form_id,
  //       SUM(p.amount) AS paid_amount,
  //       ffs.amount AS max_amount
  //     FROM payments p

  //     LEFT JOIN form_fee_structure ffs
  //     ON ffs.form_id = p.form_id AND ffs.fee_head_id = p.fee_head_id

  //     WHERE p.form_id = $1
  //     GROUP BY p.fee_head_id, p.form_id, ffs.fee_head_id, ffs.id
  //   `,
  //   [value.form_id]
  // );

  // const final_fee_structure: {
  //   fee_head_id: number;
  //   custom_min_amount: number;
  // }[] = [];

  // client_fee_structure_info.forEach((item) => {
  //   const paymentTableData = rows.find(
  //     (cItem) => cItem.fee_head_id == item.fee_head_id
  //   );

  //   const paidTillNow = parseFloat(paymentTableData?.paid_amount ?? "0.00");
  //   const maxAmount = parseFloat(paymentTableData?.max_amount ?? "0.00");

  //   if ((paidTillNow + item.custom_min_amount) > maxAmount) {
  //     const adjustAmount =
  //     final_fee_structure.push({
  //       fee_head_id: item.fee_head_id,
  //       custom_min_amount: (paidTillNow + item.custom_min_amount) - maxAmount,
  //     });
  //   } else {
  //     final_fee_structure.push();
  //   }
  // });

  const { rows, rowCount } = await pool.query(
    "SELECT student_id FROM fillup_forms WHERE id = $1",
    [value.form_id]
  );

  if (rowCount === 0)
    throw new ErrorHandler(404, "No student found of this form");

  await setPayment({
    fee_head_ids_info: client_fee_structure_info.map((item) => ({
      fee_head_id: item.fee_head_id,
      amount: item.custom_min_amount,
    })),
    form_id: value.form_id,
    mode: value.payment_mode,
    student_id: rows[0].student_id,
    transition_id: value.payment_details,
  });

  res.status(200).json(new ApiResponse(200, "New payment details added"));
});
