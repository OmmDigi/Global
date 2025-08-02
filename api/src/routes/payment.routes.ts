import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller";

export const paymentRoute = Router();

paymentRoute
.post("/create-order", createOrder)
.get("/verify", verifyPayment)
