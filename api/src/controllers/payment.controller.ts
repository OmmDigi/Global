import { pool } from "../config/db";
import { phonePe } from "../config/phonePe";
import { MONTHLY_PAYMENT_HEAD_ID } from "../constant";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { setPayment } from "../services/payment.service";
import { CustomRequest } from "../types";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import {
  VAddPayment,
  VCreateOrderValidator,
  VDeletePayment,
} from "../validator/payment.validator";

import { v4 as uuidv4 } from "uuid";

export const createOrder = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateOrderValidator.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const merchant_order_id = uuidv4();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const fee_structure_info = (
      value.fee_structure_info as {
        fee_head_id: number;
        custom_min_amount: number;
      }[]
    ).filter((item) => item.custom_min_amount != 0);

    if (fee_structure_info.length === 0) throw new ErrorHandler(400, "Nothing to pay")

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
      month: string | null;
      payment_date: string | null;
      bill_no: string | null;
      payment_mode: string | null
    }[] = [];

    const payment_date_str = new Date().toUTCString();

    rows.forEach((item) => {
      // const db_min_amount = parseFloat(item.min_amount);
      const custom_amount =
        fee_structure_info.find((fs) => fs.fee_head_id == item.fee_head_id)
          ?.custom_min_amount ?? 0;

      amountToPaid += custom_amount;

      // if (custom_amount >= db_min_amount) {
      //   amountToPaid += custom_amount;
      // } else {
      //   amountToPaid += db_min_amount;
      // }

      if (custom_amount !== 0) {
        fee_head_ids_info.push({
          fee_head_id: item.fee_head_id,
          amount: custom_amount,
          month: null,
          payment_date: payment_date_str,
          bill_no: null,
          payment_mode: null
        });
      }
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
      status: 1,
      payment_details: "Online Payment Form Website",
    });

    await client.query("COMMIT");

    res.status(201).json(
      new ApiResponse(201, "Order created", {
        payment_page_url: data.instrumentResponse.redirectInfo.url,
      })
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
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
    "UPDATE payments SET payment_name_id = $1, status = $2, transition_id = $3, order_id = $4, payment_date = $5, remark = $6 WHERE order_id = $7",
    [
      response.data.transactionId,
      payment_status[response.data.state],
      response.data.transactionId,
      response.data.orderId,
      new Date(),
      `Online Transaction ID : ${response.data.transactionId}`,
      req.query.merchant_order_id?.toString(),
    ]
  );

  // if (!response.success) {
  //   res.render("payment-status", {
  //   status: response.data.state === "COMPLETED" ? "success" : "failed",
  //   orderId: response.data.orderId,
  //   amount: response.data.amount / 100,
  //   transactionId : response.data.transactionId,
  //   frontendhomepage : process.env.FRONTEND_HOST_URL
  // });
  //   throw new ErrorHandler(400, response.message);
  // }

  res.render("payment-status", {
    status: response.data.state === "COMPLETED" ? "success" : "failed",
    orderId: response.data.orderId,
    amount: response.data.amount / 100,
    transactionId: response.data.transactionId,
    frontendhomepage: process.env.FRONTEND_HOST_URL,
  });
});

// this is from admin panel only
export const addPayment = asyncErrorHandler(async (req, res) => {
  const { error, value } = VAddPayment.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const form_id = value.form_id;

  const client_fee_structure_info = (
    value.fee_structure_info as {
      fee_head_id: number;
      custom_min_amount: number;
      month?: string;
      payment_date?: string;
      payment_mode: string;
      bill_no: string;
    }[]
  ).filter((item) => item.custom_min_amount != 0);

  if (client_fee_structure_info.length === 0)
    throw new ErrorHandler(400, "No Payment Amount To Add");

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
    [form_id]
  );

  if (rowCount === 0)
    throw new ErrorHandler(404, "No student found of this form");

  // before adding payment check if the user already paid for the month which client sent send him conflict error;
  //!! remamber one thing if monthly payment is only one than this logic will work else it could give unreal behiaver
  let monthlyPaymentMonthStartDate: string | null = null;
  const fee_head_ids_info = client_fee_structure_info.map((item) => {
    let monthFirstDateToStore: string | null = null;
    if (item.month && item.fee_head_id === MONTHLY_PAYMENT_HEAD_ID) {
      if (!/^\d{4}-\d{2}$/.test(item.month)) {
        throw new ErrorHandler(
          400,
          "Invalid month format. Use 'YYYY-MM' (e.g., 2025-08)."
        );
      }

      const monthStart = `${item.month}-01`;
      const monthDate = new Date(monthStart);
      if (isNaN(monthDate.getTime())) {
        throw new ErrorHandler(400, "Invalid month value.");
      }

      monthFirstDateToStore = monthStart;
      monthlyPaymentMonthStartDate = monthStart;
    }

    return {
      fee_head_id: item.fee_head_id,
      amount: item.custom_min_amount,
      month: monthFirstDateToStore,
      payment_date: item.payment_date ?? null,
      bill_no: item.bill_no,
      payment_mode: item.payment_mode
    };
  });

  if (monthlyPaymentMonthStartDate !== null && !value.do_continue) {
    // now need to check is any monthly payment already had or not
    const { rowCount, rows } = await pool.query(
      "SELECT TO_CHAR(month, 'FMMonth, YYYY') AS month FROM payments WHERE form_id = $1 AND month IS NOT NULL AND month = $2",
      [form_id, monthlyPaymentMonthStartDate]
    );
    if (rowCount !== 0)
      throw new ErrorHandler(
        409,
        `Student already paid payment for this month : ${rows[0].month} do you want to continue`
      );
  }

  await setPayment({
    fee_head_ids_info,
    form_id,
    mode: null,
    student_id: rows[0].student_id,
    transition_id: value.payment_details,
    status: 2,
    payment_details: value.payment_details ?? null,
  });

  res.status(200).json(new ApiResponse(200, "New payment details added"));
});

export const deletePayment = asyncErrorHandler(async (req: CustomRequest, res) => {
  const { error, value } = VDeletePayment.validate(req.params ? { ...req.params, user_id: req.user_info?.id } : {});
  if (error) throw new ErrorHandler(400, error.message);

  const client = await pool.connect();

  try {
    await client.query('BEGIN')

    const { rows, rowCount } = await client.query('DELETE FROM payments WHERE id = $1 AND form_id = $2 RETURNING *', [value.id, value.form_id]);

    if (rowCount === 0) {
      throw new ErrorHandler(404, "No admission form found")
    }

    const paymentInfoJson = JSON.stringify(rows[0]);

    await client.query("INSERT INTO deleted_payments (payment_row_id, payment_info, form_id, user_id) VALUES ($1, $2, $3, $4)", [rows[0].id, paymentInfoJson, rows[0].form_id, value.user_id])

    await client.query('COMMIT');

    res.status(200).json(new ApiResponse(200, "Payment info successfully removed"))
  } catch (error: any) {
    await client.query('ROLLBACK');
    throw new ErrorHandler(400, error.message)
  } finally {
    client.release()
  }
});