import { Router } from "express";
import { addEsslConfig } from "../controllers/settings.controller";

export const settingsRoutes = Router();

settingsRoutes
.post("/essl-config", addEsslConfig)