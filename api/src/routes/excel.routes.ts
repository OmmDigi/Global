import { Router } from "express";
import { createEmployeeSalarySheet, generatePaymentExcelReport, generateUrl, getAdmissionExcelReport } from "../controllers/excel.controller";
import { isAuthorized } from "../middlewares/isAuthorized";
import { verifySignedUrl } from "../middlewares/verifySignedUrl";

export const excelRoute = Router();

excelRoute
    .post("/url", isAuthorized([13, 6, 12]), generateUrl)
    .get("/payment-report", verifySignedUrl, generatePaymentExcelReport)
    .get("/admission-report", verifySignedUrl, getAdmissionExcelReport)
    .get("/salary-sheet", verifySignedUrl, createEmployeeSalarySheet)
    // .get("/inventory-report", verifySignedUrl, createInventoryReport)
    // .get("/inventory-report", verifySignedUrl, createInventoryReport)