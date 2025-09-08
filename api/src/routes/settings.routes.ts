import { Router } from "express";
import {
  addEsslConfig,
  getEsslConfig,
} from "../controllers/settings.controller";
import { isAuthorized } from "../middlewares/isAuthorized";

export const settingsRoutes = Router();

settingsRoutes
  .post("/essl-config", isAuthorized(15), addEsslConfig)
  .get("/essl-config", isAuthorized(15), getEsslConfig);
