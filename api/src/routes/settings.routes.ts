import { Router } from "express";
import {
  addEsslConfig
} from "../controllers/settings.controller";
import { isAuthorized } from "../middlewares/isAuthorized";

export const settingsRoutes = Router();

settingsRoutes
  .post("/essl-config", isAuthorized(15), addEsslConfig)
