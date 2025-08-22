import { Router } from "express";
import {
  createUser,
  deleteUser,
  getOneUser,
  getSingleTeacherDailyClassStatus,
  getUserEnrolledCourseList,
  getUserLeaveRequest,
  getUserSingleAdmissionData,
  getUsersList,
  loginUser,
  manageTeacherDailyClassStatus,
  updateUser,
} from "../controllers/users.controller";
import { isAuthorized } from "../middlewares/isAuthorized";
import { isAuthenticated } from "../middlewares/isAuthenticated";

export const usersRoutes = Router();

usersRoutes
  .post("/login", loginUser)
  .post("/create", isAuthorized(7), createUser)
  .get("/course", isAuthenticated, getUserEnrolledCourseList)
  .get("/admission/:form_id", isAuthenticated, getUserSingleAdmissionData)
  .get("/leave", isAuthenticated, getUserLeaveRequest)
  
  .get("/class", isAuthenticated, getSingleTeacherDailyClassStatus)
  .post("/class", isAuthenticated, manageTeacherDailyClassStatus)

  .get("/:id", isAuthorized(7, true), getOneUser)
  .get("/", isAuthorized(7), getUsersList)
  .put("/", isAuthorized(7), updateUser)
  .delete("/:id", isAuthorized(7), deleteUser)
