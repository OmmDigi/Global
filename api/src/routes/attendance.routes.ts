import { Router } from "express";
import {editTeacherClassStatus, getAttendanceList, getSingleEmployeeAttendanceList, getTeacherClassStatusList, processAttendaceToTheDb, storeAttendance, syncAttendanceFromTheDevice } from "../controllers/attendance.controller";
import { isAuthorized } from "../middlewares/isAuthorized";

export const attendanceRoute = Router();

attendanceRoute
    .post("/", storeAttendance)
    .get("/", getAttendanceList)

    .post("/sync", syncAttendanceFromTheDevice)
    .post("/process", processAttendaceToTheDb)

    .get("/class", isAuthorized(12), getTeacherClassStatusList)
    .post("/class", isAuthorized(12), editTeacherClassStatus)

    .get("/:id", getSingleEmployeeAttendanceList)