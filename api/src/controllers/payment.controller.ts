import { pool } from "../config/db";
import { phonePe } from "../config/phonePe";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { setPayment } from "../services/payment.service";
import { ApiResponse } from "../utils/ApiResponse";
import { ErrorHandler } from "../utils/ErrorHandler";
import { VCreateOrderValidator } from "../validator/payment.validator";

import { v4 as uuidv4 } from "uuid";

export const createOrder = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateOrderValidator.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const merchant_order_id = uuidv4();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const fee_head_ids = value.fee_head_ids as number[];
    const placeholder = fee_head_ids
      .map((_, index) => `$${index + 2}`)
      .join(", ");

    const { rows, rowCount } = await client.query(
      `
      SELECT 
        ffs.fee_head_id,
        ffs.amount,
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
      fee_head_ids.flatMap((id) => [value.form_id, id])
    );

    if (rowCount === 0) throw new ErrorHandler(400, "No admission form found");

    const student_id = rows[0].student_id;
    const student_name = rows[0].student_name;
    const student_ph_number = rows[0].student_ph_number;

    let amountToPaid = 0;
    const fee_head_ids_info: { fee_head_id: number; amount: number }[] = [];

    rows.forEach((item) => {
      amountToPaid += parseFloat(item.amount);
      fee_head_ids_info.push({
        fee_head_id: item.fee_head_id,
        amount: item.amount,
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
    throw new ErrorHandler(400, error.message);
  } finally {
    client.release();
  }
});

export const verifyPayment = asyncErrorHandler(async (req, res) => {
  const response = await phonePe().checkStatus(req.query.merchant_order_id?.toString() ?? "");

  // after verify add transactionId as payment_name_id and change the status of the payment table
  const payment_status : any = {
    'PENDING' : 1,
    'COMPLETED' : 2,
    'FAILED' : 3,
  }

  await pool.query(
    "UPDATE payments SET payment_name_id = $1, status = $2 WHERE order_id = $3",
    [response.data.transactionId, payment_status[response.data.state], req.query.merchant_order_id]
  )

  if(!response.success) throw new ErrorHandler(400, response.message);
  
  res.status(200).json(new ApiResponse(200, "Payment Done"));
});
