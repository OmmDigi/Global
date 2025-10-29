import { Router } from "express";
import { addPayment, createOrder, deletePayment, verifyPayment } from "../controllers/payment.controller";
import { isAuthorized } from "../middlewares/isAuthorized";

export const paymentRoute = Router();

paymentRoute
    .post("/create-order", createOrder)
    .get("/verify", verifyPayment)
    .post("/add", isAuthorized(6), addPayment)
    .put("/add", isAuthorized(6), addPayment)
    .delete("/:form_id/:id", isAuthorized(6), deletePayment) //the person who have option of the admission module can delete the payment
