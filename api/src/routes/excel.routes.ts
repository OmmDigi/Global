import { Router } from "express";
import { createEmployeeSalarySheet, createInventoryReport, generatePaymentExcelReport, generateUrl, getAdmissionExcelReport, monthlyPaymentReport, newAdmissionExcelReport, studetnFeeSummaryReport, totalPaymentReport } from "../controllers/excel.controller";
import { isAuthorized } from "../middlewares/isAuthorized";
import { verifySignedUrl } from "../middlewares/verifySignedUrl";

export const excelRoute = Router();

excelRoute
    .post("/url", isAuthorized([13, 15, 6, 11, 8]), generateUrl)
    .get("/payment-report", verifySignedUrl, generatePaymentExcelReport)
    .get("/admission-report", verifySignedUrl, newAdmissionExcelReport)
    .get("/monthly-payment-report", verifySignedUrl, monthlyPaymentReport)
    .get("/salary-sheet", verifySignedUrl, createEmployeeSalarySheet)
    .get("/fee-summery", verifySignedUrl, studetnFeeSummaryReport)
    .get("/total-payment-report", totalPaymentReport)
    // .get("/inventory-report", verifySignedUrl, createInventoryReport)
    .get("/inventory-report", verifySignedUrl, createInventoryReport)