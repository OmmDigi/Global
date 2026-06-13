import { Router } from "express";
import {
  addPayment,
  checkLateFine,
  createOrder,
  deletePayment,
  getPaymentsList,
  updatePaymentBillNo,
  verifyPayment,
} from "../controllers/payment.controller";
import { isAuthorized } from "../middlewares/isAuthorized";

export const paymentRoute = Router();

paymentRoute
  .post("/create-order", createOrder)
  .get("/verify", verifyPayment)
  .get("/check-late-fine", checkLateFine)
  .get("/list", isAuthorized(17), getPaymentsList)
  .patch("/bill-no", isAuthorized(6), updatePaymentBillNo)
  .post("/add", isAuthorized(6), addPayment)
  .put("/add", isAuthorized(6), addPayment)
  .delete("/:form_id/:id", isAuthorized(6), deletePayment); //the person who have option of the admission module can delete the payment
