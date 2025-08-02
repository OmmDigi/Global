import { Router } from "express";
import { createAdmission } from "../controllers/admission.controller";

export const admissionRoute = Router();

admissionRoute.post("/create", createAdmission);
