import { Router } from "express";
import { isAuthorized } from "../middlewares/isAuthorized";
import {
  addPurchaseRecord,
  getPurchaseRecordList,
  getSinglePurchaseRecord,
  //   deletePurchaseRecored,
  updatePurchaseRecord,
} from "../controllers/purchase.controller";

export const purchaseRoute = Router();

purchaseRoute
  .post("/", isAuthorized(9), addPurchaseRecord)
  .put("/", isAuthorized(9), updatePurchaseRecord)
  .get("/:id", isAuthorized(9), getSinglePurchaseRecord)
  .get("/", isAuthorized(9), getPurchaseRecordList);
