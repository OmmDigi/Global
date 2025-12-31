import { Router } from "express";
import {
  addLoanOrAdvancePayment,
  changePassword,
  createUser,
  deleteUser,
  doEnquiry,
  generatePayslip,
  getAllEnquiry,
  getChangePasswordPage,
  getLoanList,
  getOneUser,
  getPayslip,
  getPayslipList,
  getSingleLoanInfo,
  getSingleTeacherDailyClassStatus,
  getUserEnrolledCourseList,
  getUserLeaveRequest,
  getUserSingleAdmissionData,
  getUsersList,
  loginUser,
  manageTeacherDailyClassStatus,
  updateEnquiryStatus,
  updateLoadnInfo,
  updateUser,
} from "../controllers/users.controller";
import { isAuthorized } from "../middlewares/isAuthorized";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import asyncErrorHandler from "../middlewares/asyncErrorHandler";
import { ApiResponse } from "../utils/ApiResponse";

export const usersRoutes = Router();

usersRoutes
  .get(
    "/is-login",
    isAuthenticated,
    asyncErrorHandler(async (_, res) => {
      res.status(200).json(new ApiResponse(200, "Login successfull", true));
    })
  )
  .post("/enquiry", doEnquiry)
  .get("/enquiry", isAuthorized(16), getAllEnquiry)
  .patch("/enquiry", isAuthorized(16), updateEnquiryStatus)
  .get("/change-password", getChangePasswordPage)
  .post("/change-password", changePassword)
  .post("/login", loginUser)
  .post("/create", isAuthorized(7), createUser)
  .get("/course", isAuthenticated, getUserEnrolledCourseList)
  .get("/admission/:form_id", isAuthenticated, getUserSingleAdmissionData)
  .get("/leave", isAuthenticated, getUserLeaveRequest)

  .get("/class", isAuthenticated, getSingleTeacherDailyClassStatus)
  .post("/class", isAuthenticated, manageTeacherDailyClassStatus)

  .get("/payslip", isAuthorized(11), getPayslipList)
  .get("/payslip/:id", getPayslip)
  .post("/payslip", isAuthorized(11), generatePayslip)

  .post("/loan", isAuthorized(11), addLoanOrAdvancePayment)
  .put("/loan", isAuthorized(11), updateLoadnInfo)
  .get("/loan", isAuthorized(11), getLoanList)
  .get("/loan/:id", isAuthorized(11), getSingleLoanInfo)

  .get("/:id", isAuthorized(7, true), getOneUser)
  .get("/", isAuthorized(7), getUsersList)
  .put("/", isAuthorized(7), updateUser)
  .delete("/:id", isAuthorized(7), deleteUser);
