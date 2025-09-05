import { Router } from "express";
import {
  acceptDeclarationStatus,
  createAdmission,
  // downloadDeclarationStatus,
  getAdmissionList,
  getSingleAdmission,
  getSingleAdmissionFormData,
  updateAdmissionData,
  updateAdmissionStatus,
} from "../controllers/admission.controller";
import { isAuthorized } from "../middlewares/isAuthorized";
import { isAuthenticated } from "../middlewares/isAuthenticated";
// import { getAdmissionExcelReport } from "../controllers/excel.controller";

export const admissionRoute = Router();

admissionRoute
  .post("/create", createAdmission)
  .get("/", isAuthorized(6), getAdmissionList)
  // .get("/excel", isAuthorized(6), getAdmissionExcelReport)
  .patch("/", isAuthorized(6), updateAdmissionStatus)
  .get("/form/:form_id", isAuthorized(6), getSingleAdmissionFormData)
  .put("/form", isAuthorized(6), updateAdmissionData)
  .patch("/accept-declaration-status", isAuthenticated, acceptDeclarationStatus)
  // .get("/declaration-status/download", isAuthorized(6), downloadDeclarationStatus)
  .get("/:form_id", isAuthorized(6), getSingleAdmission)

