import { Router } from "express";
import { addPayment, createOrder, verifyPayment } from "../controllers/payment.controller";

export const paymentRoute = Router();

paymentRoute
.post("/create-order", createOrder)
.get("/verify", verifyPayment)
.post("/add", addPayment)
