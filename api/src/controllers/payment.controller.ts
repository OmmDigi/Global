import { pool } from "../config/db";
import { phonePe } from "../config/phonePe";
import { LATE_FINE_FEE_HEAD_ID, MONTHLY_PAYMENT_HEAD_ID } from "../constant";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import {
  checkLateFineService,
  deletePaymentService,
  setPayment,
} from "../services/payment.service";
import { CustomRequest } from "../types";
import { ApiResponse } from "../utils/ApiResponse";
import { doTransition } from "../utils/doTransition";
import { ErrorHandler } from "../utils/ErrorHandler";
import {
  VAddPayment,
  VCheckFine,
  VCreateOrderValidator,
  VDeletePayment,
  VGetPayments,
  VUpdateBillNo,
} from "../validator/payment.validator";

import { v4 as uuidv4 } from "uuid";

export const createOrder = asyncErrorHandler(async (req, res) => {
  const { error, value } = VCreateOrderValidator.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const merchant_order_id = uuidv4();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // removing all 0 amount fields
    const fee_structure_info = (
      value.fee_structure_info as {
        fee_head_id: number;
        custom_min_amount: number;
        month: string | null;
      }[]
    ).filter((item) => item.custom_min_amount != 0);

    // if no single fee to process throw error
    if (fee_structure_info.length === 0)
      throw new ErrorHandler(400, "Nothing to pay");

    const monthlyEntries = fee_structure_info.filter(
      (f) => f.fee_head_id == MONTHLY_PAYMENT_HEAD_ID,
    );

    // Validate months and check late fine for all selected months in one call
    if (monthlyEntries.length > 0) {
      const months = monthlyEntries
        .map((e) => e.month)
        .filter((m): m is string => !!m);

      if (months.length < monthlyEntries.length) {
        throw new ErrorHandler(400, "Please choose monthly payment month");
      }

      const { amount, fineAmount } = await checkLateFineService(
        months,
        value.form_id,
      );
      if (amount > 0) {
        months.forEach((month) => {
          fee_structure_info.push({
            fee_head_id: LATE_FINE_FEE_HEAD_ID,
            custom_min_amount: fineAmount,
            month: month,
          });
        });
      }
    }

    // Use unique fee_head_ids for the IN clause
    const uniqueFeeHeadIds = [
      ...new Set(fee_structure_info.map((f) => f.fee_head_id)),
    ];
    const placeholder = uniqueFeeHeadIds
      .map((_, index) => `$${index + 2}`)
      .join(", ");

    const { rows, rowCount } = await client.query<{
      fee_head_id: number;
      amount: string;
      min_amount: string;
      required: boolean;
      form_name: string;
      student_id: number;
      student_name: string;
      student_ph_number: string;
    }>(
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
      [value.form_id, ...uniqueFeeHeadIds],
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
      payment_mode: string | null;
      payment_details: string | null;
    }[] = [];

    const payment_date_str = new Date().toUTCString();
    // const lateFineEntries = fee_structure_info.filter(
    //   (f) => f.fee_head_id == LATE_FINE_FEE_HEAD_ID,
    // );

    // rows.forEach((item) => {
    //   if (item.fee_head_id == MONTHLY_PAYMENT_HEAD_ID) {
    //     // One payment row per selected month
    //     monthlyEntries.forEach((monthEntry) => {
    //       const custom_amount = parseFloat(
    //         monthEntry.custom_min_amount.toString(),
    //       );
    //       if (custom_amount !== 0) {
    //         amountToPaid += custom_amount;
    //         fee_head_ids_info.push({
    //           fee_head_id: item.fee_head_id,
    //           amount: custom_amount,
    //           month: monthEntry.month ? `${monthEntry.month}-01` : null,
    //           payment_date: payment_date_str,
    //           bill_no: null,
    //           payment_mode: null,
    //           payment_details: null,
    //         });
    //       }
    //     });
    //   } else if (item.fee_head_id == LATE_FINE_FEE_HEAD_ID) {
    //     // Single combined fine entry for all months
    //     const lateFineEntry = lateFineEntries[0];
    //     if (lateFineEntry) {
    //       const custom_amount = parseFloat(
    //         lateFineEntry.custom_min_amount.toString(),
    //       );
    //       if (custom_amount !== 0) {
    //         amountToPaid += custom_amount;
    //         fee_head_ids_info.push({
    //           fee_head_id: item.fee_head_id,
    //           amount: custom_amount,
    //           month: null,
    //           payment_date: payment_date_str,
    //           bill_no: null,
    //           payment_mode: null,
    //           payment_details: null,
    //         });
    //       }
    //     }
    //   } else {
    //     const singleFeeStructure = fee_structure_info.find(
    //       (fs) => fs.fee_head_id == item.fee_head_id,
    //     );
    //     const custom_amount = parseFloat(
    //       singleFeeStructure?.custom_min_amount.toString() ?? "0",
    //     );
    //     amountToPaid += custom_amount;
    //     if (custom_amount !== 0) {
    //       fee_head_ids_info.push({
    //         fee_head_id: item.fee_head_id,
    //         amount: custom_amount,
    //         month: singleFeeStructure?.month
    //           ? `${singleFeeStructure.month}-01`
    //           : null,
    //         payment_date: payment_date_str,
    //         bill_no: null,
    //         payment_mode: null,
    //         payment_details: null,
    //       });
    //     }
    //   }
    // });

    rows.forEach((row) => {
      // check for user send custom amount and db custom amount same or not if not throw error
      fee_structure_info.forEach((feeStructure) => {
        if (row.fee_head_id != feeStructure.fee_head_id) return;

        // if (row.fee_head_id == LATE_FINE_FEE_HEAD_ID) {
        //   amountToPaid += feeStructure.custom_min_amount;
        //   fee_head_ids_info.push({
        //     amount: feeStructure.custom_min_amount,
        //     bill_no: null,
        //     fee_head_id: feeStructure.fee_head_id,
        //     month: feeStructure.month ? `${feeStructure.month}-01` : null,
        //     payment_date: payment_date_str,
        //     payment_details: null,
        //     payment_mode: "Online",
        //   });
        //   return;
        // }

        // if (parseInt(row.min_amount) != feeStructure.custom_min_amount) {
        //   console.log("row", row);
        //   console.log("feeStructure", feeStructure);
        //   throw new ErrorHandler(
        //     400,
        //     "You cannot pay more or less amount of a decided fee",
        //   );
        // }

        amountToPaid += feeStructure.custom_min_amount;
        fee_head_ids_info.push({
          amount: feeStructure.custom_min_amount,
          bill_no: null,
          fee_head_id: feeStructure.fee_head_id,
          month: feeStructure.month ? `${feeStructure.month}-01` : null,
          payment_date: payment_date_str,
          payment_details: null,
          payment_mode: "Online",
        });
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
      status: 1,
      payment_details: "Online Payment Form Website",
    });

    await client.query("COMMIT");

    res.status(201).json(
      new ApiResponse(201, "Order created", {
        payment_page_url: data.instrumentResponse.redirectInfo.url,
      }),
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
    req.query.merchant_order_id?.toString() ?? "",
  );

  // after verify add transactionId as payment_name_id and change the status of the payment table
  const payment_status: any = {
    PENDING: 1,
    COMPLETED: 2,
    FAILED: 3,
  };

  // await pool.query(
  //   "UPDATE payments SET payment_name_id = $1, status = $2, transition_id = $3, order_id = $4, payment_date = $5, remark = $6 WHERE order_id = $7",
  //   [
  //     response.data.transactionId,
  //     payment_status[response.data.state],
  //     response.data.transactionId,
  //     response.data.orderId,
  //     new Date(),
  //     `Online Transaction ID : ${response.data.transactionId}`,
  //     req.query.merchant_order_id?.toString(),
  //   ],
  // );

  await doTransition(async (client) => {
    const paymentUpdateInfo = await client.query<{
      form_id: number;
      amount: number;
      fee_head_id: number;
    }>(
      "UPDATE payments SET payment_name_id = $1, status = $2, transition_id = $3, order_id = $4, payment_date = $5, remark = $6 WHERE order_id = $7 RETURNING form_id, amount, fee_head_id",
      [
        response.data.transactionId,
        payment_status[response.data.state],
        response.data.transactionId,
        response.data.orderId,
        // new Date(),
        new Date(response.data.paymentInstrument[0].timestamp),
        `Online Transaction ID : ${response.data.transactionId}`,
        req.query.merchant_order_id?.toString(),
      ],
    );

    const totalLateFine = paymentUpdateInfo.rows.reduce(
      (prev, current) =>
        current.fee_head_id == LATE_FINE_FEE_HEAD_ID
          ? prev + parseFloat(current.amount.toString())
          : prev + 0,
      0,
    );

    if (totalLateFine > 0) {
      await client.query(
        "UPDATE form_fee_structure SET amount = amount + $1, min_amount = amount WHERE form_id = $2 AND fee_head_id = $3",
        [
          totalLateFine,
          paymentUpdateInfo.rows[0].form_id,
          LATE_FINE_FEE_HEAD_ID,
        ],
      );
    }
  });

  res.render("payment-status", {
    status: response.data.state === "COMPLETED" ? "success" : "failed",
    orderId: response.data.orderId,
    amount: response.data.amount / 100,
    transactionId: response.data.transactionId,
    frontendhomepage: process.env.FRONTEND_HOST_URL,
  });
});

export const checkLateFine = asyncErrorHandler(async (req, res) => {
  // check the late fine
  const { error, value } = VCheckFine.validate(req.query ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const { amount } = await checkLateFineService(
    Array.isArray(value.pay_month) ? value.pay_month : [value.pay_month],
    value.form_id,
  );
  res.status(200).json(new ApiResponse(200, "Successfull", { amount }));
});

// this is from admin panel only
export const addPayment = asyncErrorHandler(async (req: CustomRequest, res) => {
  const { error, value } = VAddPayment.validate(
    req.body ? { ...req.body, user_id: req.user_info?.id } : {},
  );
  if (error) throw new ErrorHandler(400, error.message);

  const form_id = value.form_id;

  const client_fee_structure_info = (
    value.fee_structure_info as {
      id: number | null;
      fee_head_id: number;
      custom_min_amount: number;
      month?: string;
      payment_date?: string;
      payment_mode: string;
      payment_details: string | null;
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
    [form_id],
  );

  if (rowCount === 0)
    throw new ErrorHandler(404, "No student found of this form");

  // before adding payment check if the user already paid for the month which client sent send him conflict error;
  //!! remamber one thing if monthly payment is only one than this logic will work else it could give unreal behiaver
  let monthlyPaymentMonthStartDate: string | null = null;
  const fee_head_ids_info = client_fee_structure_info.map((item) => {
    let monthFirstDateToStore: string | null = null;
    if (
      item.month &&
      (item.fee_head_id === MONTHLY_PAYMENT_HEAD_ID ||
        item.fee_head_id === LATE_FINE_FEE_HEAD_ID)
    ) {
      if (!/^\d{4}-\d{2}$/.test(item.month)) {
        throw new ErrorHandler(
          400,
          "Invalid month format. Use 'YYYY-MM' (e.g., 2025-08).",
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
      payment_mode: item.payment_mode,
      payment_details: item.payment_details,
    };
  });

  if (monthlyPaymentMonthStartDate !== null && !value.do_continue) {
    // now need to check is any monthly payment already had or not
    const { rowCount, rows } = await pool.query(
      "SELECT TO_CHAR(month, 'FMMonth, YYYY') AS month FROM payments WHERE form_id = $1 AND month IS NOT NULL AND month = $2",
      [form_id, monthlyPaymentMonthStartDate],
    );
    if (rowCount !== 0)
      throw new ErrorHandler(
        409,
        `Student already paid payment for this month : ${rows[0].month} do you want to continue`,
      );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    if (value.type === "update") {
      await deletePaymentService({
        form_id,
        ids: client_fee_structure_info.map((item) => item.id),
        user_id: value.user_id,
        client,
      });
    }

    await setPayment({
      fee_head_ids_info,
      form_id,
      mode: null,
      student_id: rows[0].student_id,
      // transition_id: value.payment_details,
      status: 2,
      // payment_details: value.payment_details ?? null,
      payment_details: null,
      client,
    });

    await client.query("COMMIT");

    if (value.type === "add") {
      return res
        .status(200)
        .json(new ApiResponse(200, "Payment info successfully removed"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Payment info successfully updated"));
  } catch (error: any) {
    await client.query("ROLLBACK");
    throw new ErrorHandler(400, error.message);
  } finally {
    client.release();
  }
});

export const getPaymentsList = asyncErrorHandler(async (req, res) => {
  const { error, value } = VGetPayments.validate(req.query ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const params: any[] = [];
  const conditions: string[] = [];
  let idx = 1;

  conditions.push(`p.status = 2`);

  if (value.mode === "Online") {
    conditions.push(`p.mode = $${idx++}`);
    params.push("Online");
  } else {
    conditions.push(`(p.mode != $${idx++} OR p.mode IS NULL)`);
    params.push("Online");
  }

  if (value.from_date) {
    conditions.push(`p.payment_date >= $${idx++}`);
    params.push(value.from_date);
  }
  if (value.to_date) {
    conditions.push(`p.payment_date <= $${idx++}`);
    params.push(value.to_date);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;
  const limit = 20;
  const offset = (value.page - 1) * limit;

  const [listResult, countResult] = await Promise.all([
    pool.query(
      `SELECT
        p.id,
        p.form_id,
        p.mode,
        p.amount,
        p.status,
        p.transition_id,
        p.receipt_id,
        p.order_id,
        p.payment_date,
        p.month,
        p.bill_no,
        p.remark,
        p.created_at,
        u.name AS student_name,
        ff.form_name,
        cfh.name AS fee_head_name
      FROM payments p
      LEFT JOIN users u ON p.student_id = u.id
      LEFT JOIN fillup_forms ff ON p.form_id = ff.id
      LEFT JOIN course_fee_head cfh ON p.fee_head_id = cfh.id
      ${whereClause}
      ORDER BY p.created_at DESC
      LIMIT $${idx++} OFFSET $${idx++}`,
      [...params, limit, offset],
    ),
    pool.query(
      `SELECT COUNT(*) FROM payments p ${whereClause}`,
      params,
    ),
  ]);

  res.status(200).json({
    status: 200,
    message: "Payments list",
    data: listResult.rows,
    total: parseInt(countResult.rows[0].count),
    page: value.page,
    limit,
  });
});

export const updatePaymentBillNo = asyncErrorHandler(async (req, res) => {
  const { error, value } = VUpdateBillNo.validate(req.body ?? {});
  if (error) throw new ErrorHandler(400, error.message);

  const { rows, rowCount } = await pool.query(
    "UPDATE payments SET bill_no = $1 WHERE id = $2 RETURNING id, bill_no",
    [value.bill_no, value.id],
  );

  if (rowCount === 0) throw new ErrorHandler(404, "Payment not found");

  res.status(200).json(new ApiResponse(200, "Bill no updated", rows[0]));
});

export const deletePayment = asyncErrorHandler(
  async (req: CustomRequest, res) => {
    const { error, value } = VDeletePayment.validate(
      req.params ? { ...req.params, user_id: req.user_info?.id } : {},
    );
    if (error) throw new ErrorHandler(400, error.message);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await deletePaymentService({
        form_id: value.form_id,
        ids: [value.id],
        user_id: value.user_id,
        client,
      });

      await client.query("COMMIT");

      res
        .status(200)
        .json(new ApiResponse(200, "Payment info successfully removed"));
    } catch (error: any) {
      await client.query("ROLLBACK");
      throw new ErrorHandler(400, error.message);
    } finally {
      client.release();
    }
  },
);
