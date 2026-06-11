import { Router } from "express";
import {
  addEsslConfig,
  backupDatabase,
  getLateFineConfig,
  saveLateFineConfig,
} from "../controllers/settings.controller";
import { isAuthorized } from "../middlewares/isAuthorized";

export const settingsRoutes = Router();

settingsRoutes
  .post("/essl-config", isAuthorized(15), addEsslConfig)
  .post("/backup-database", isAuthorized(15), backupDatabase)
  .get("/late-fine-config", getLateFineConfig)
  .post("/late-fine-config", isAuthorized(15), saveLateFineConfig);
