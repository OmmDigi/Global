import { Router } from "express";
import {editTeacherClassStatus, getAttendanceList, getSingleEmployeeAttendanceList, getTeacherClassStatusList, storeAttendance } from "../controllers/attendance.controller";
import { isAuthorized } from "../middlewares/isAuthorized";

export const attendanceRoute = Router();

attendanceRoute
    .post("/", storeAttendance)
    .get("/", getAttendanceList)

    .get("/class", isAuthorized(12), getTeacherClassStatusList)
    .post("/class", isAuthorized(12), editTeacherClassStatus)

    .get("/:id", getSingleEmployeeAttendanceList)