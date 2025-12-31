import { Router } from "express";
import {
  addEsslConfig,
  backupDatabase
} from "../controllers/settings.controller";
import { isAuthorized } from "../middlewares/isAuthorized";

export const settingsRoutes = Router();

settingsRoutes
  .post("/essl-config", isAuthorized(15), addEsslConfig)
  .post("/backup-database", isAuthorized(15), backupDatabase)
