import { Router } from "express";
import { getAttendanceList, getSingleEmployeeAttendanceList, storeAttendance } from "../controllers/attendance.controller";

export const attendanceRoute = Router();

attendanceRoute
    .post("/", storeAttendance)
    .get("/", getAttendanceList)
    .get("/:id", getSingleEmployeeAttendanceList)