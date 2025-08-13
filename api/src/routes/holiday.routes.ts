import { Router } from "express";
import {
  addHolidayInfo,
  deleteHolidayInfo,
  getHolidayList,
  getSingleHoliday,
  updateHolidayInfo,
} from "../controllers/holiday.controller";

export const holidayRoutes = Router();

holidayRoutes
  .post("/", addHolidayInfo)
  .put("/", updateHolidayInfo)
  .delete("/:id", deleteHolidayInfo)
  .get("/", getHolidayList)
  .get("/:id", getSingleHoliday)
