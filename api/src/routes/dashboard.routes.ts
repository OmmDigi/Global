import { Router } from "express";
import { isAuthorized } from "../middlewares/isAuthorized";
import { getMonthlyIncome, getPerDayAttendance, getYearlyAdmission } from "../controllers/dashboard.controller";

export const dashboardRoutes = Router();

dashboardRoutes
  .get("/admission", isAuthorized(1), getYearlyAdmission)
  .get("/income", isAuthorized(1), getMonthlyIncome)
  .get("/attendance", isAuthorized(1), getPerDayAttendance)
