import { Router } from "express";
import {
  createLeaveRequest,
  deleteLeaveRequest,
  getLeaveRequestList,
  updateLeaveStatus,
} from "../controllers/leave.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { isAuthorized } from "../middlewares/isAuthorized";

export const leaveRoute = Router();

leaveRoute
  .post("/", isAuthenticated, createLeaveRequest)
  .get("/", isAuthenticated, isAuthorized(3), getLeaveRequestList)
  .delete("/:id", isAuthenticated, isAuthorized(3, true), deleteLeaveRequest) // should be admin
  .patch("/", isAuthenticated, isAuthorized(3), updateLeaveStatus); // should be admin
