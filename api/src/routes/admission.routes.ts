import { Router } from "express";
import {
  createAdmission,
  getAdmissionList,
  getSingleAdmission,
} from "../controllers/admission.controller";

export const admissionRoute = Router();

admissionRoute
  .post("/create", createAdmission)
  .get("/", getAdmissionList)
  .get("/:form_id", getSingleAdmission)
