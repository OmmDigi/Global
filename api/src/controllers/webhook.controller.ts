import crypto from "crypto";

import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { doTransition } from "../utils/doTransition";
import { LATE_FINE_FEE_HEAD_ID, MONTHLY_PAYMENT_HEAD_ID } from "../constant";

export const verifyPhonepePayment = asyncErrorHandler(async (req, res) => {
  // === 1. Check Basic Auth ===
  // PhonePe uses Basic Auth: username and password that you created in PhonePe dashboard.
  const incomingHeader = req.headers["authorization"];
  if (!incomingHeader) {
    return res
      .status(401)
      .json({ message: "Missing or invalid Authorization header" });
  }

  // Check against your configured webhook credentials
  const expectedUsername = process.env.PHONEPE_WEBHOOK_USER;
  const expectedPassword = process.env.PHONEPE_WEBHOOK_PASS;

  const expectedHash = crypto
    .createHash("sha256")
    .update(`${expectedUsername}:${expectedPassword}`)
    .digest("hex");

  if (expectedHash !== incomingHeader) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // === 2. Parse payload ===
  const rawBody = req.body.toString("utf8");
  const event = JSON.parse(rawBody);

  // Now handle events:
  console.log("📩 Received PhonePe webhook event:", event);

  // Example: handle event types
  let status: string = "PENDING";
  let paymentid: string | null = null;
  let created_at: Date | null = null;
  let orderid: string | null = null;
  let dbSearchId: string | null = null;

  switch (event.event) {
    case "checkout.order.completed":
      // Process completed payment
      console.log("Order completed:", event.payload);
      status = "COMPLETED";
      paymentid = event.payload.paymentDetails[0].transactionId;
      created_at = new Date(event.payload.paymentDetails[0].timestamp);
      orderid = event.payload.orderId;
      dbSearchId = event.payload.merchantOrderId;
      break;

    case "checkout.order.failed":
      console.log("Order failed:", event.payload);
      status = "FAILED";
      paymentid = event.payload.paymentDetails[0].transactionId;
      created_at = new Date(event.payload.paymentDetails[0].timestamp);
      orderid = event.payload.orderId;
      dbSearchId = event.payload.merchantOrderId;
      break;

    default:
      console.log("Unhandled PhonePe event:", event.event);
      return res.sendStatus(200); // Always ack unhandled events
  }

  await doTransition(async (client) => {
    const paymentUpdateInfo = await client.query<{
      form_id: number;
      amount: number;
      fee_head_id: number;
    }>(
      "UPDATE payments SET payment_name_id = $1, status = $2, transition_id = $3, order_id = $4, payment_date = $5, remark = $6 WHERE order_id = $7 RETURNING form_id, amount, fee_head_id",
      [
        paymentid,
        status,
        paymentid,
        orderid,
        created_at,
        `Online Transaction ID : ${paymentid}`,
        dbSearchId,
      ],
    );

    const lateFineFeeHeadPayment = paymentUpdateInfo.rows.find(
      (item) => item.fee_head_id == LATE_FINE_FEE_HEAD_ID,
    );

    if (lateFineFeeHeadPayment) {
      await client.query(
        "UPDATE form_fee_structure SET amount = amount + $1, min_amount = amount WHERE form_id = $2 AND fee_head_id = $3",
        [
          lateFineFeeHeadPayment.amount,
          lateFineFeeHeadPayment.form_id,
          lateFineFeeHeadPayment.fee_head_id,
        ],
      );
    }
  });

  // === 3. Respond with 200 status quickly ===
  // PhonePe considers webhook delivered if you return a 2xx status within a few seconds
  return res.sendStatus(200);
});
