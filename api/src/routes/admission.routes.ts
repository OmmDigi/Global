import { Router } from "express";
import {
  createAdmission,
  getAdmissionList,
  getSingleAdmission,
  getSingleAdmissionFormData,
  updateAdmissionData,
} from "../controllers/admission.controller";
import { isAuthorized } from "../middlewares/isAuthorized";

export const admissionRoute = Router();

admissionRoute
  .post("/create", createAdmission)
  .get("/", isAuthorized(6), getAdmissionList)
  .get("/form/:form_id", isAuthorized(6), getSingleAdmissionFormData)
  .put("/form", isAuthorized(6), updateAdmissionData)
  .get("/:form_id", isAuthorized(6), getSingleAdmission);
