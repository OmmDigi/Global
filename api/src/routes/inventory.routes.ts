import { Router } from "express";
import { isAuthorized } from "../middlewares/isAuthorized";
import { addItemStock, addNewInventoryItem, deleteInventoryItem, editItemInfo, getCurrentDateReport, getSingleInventoryItemInfo } from "../controllers/inventory.controller";

export const inventoryRoutes = Router();

inventoryRoutes
  .post("/item/add", isAuthorized(8), addNewInventoryItem)
  .post("/item/stock/add", isAuthorized(8), addItemStock)
  .get("/item", isAuthorized(8), getCurrentDateReport)
  .put("/item/edit", isAuthorized(8), editItemInfo)
  .get("/item/:item_id", isAuthorized(8), getSingleInventoryItemInfo)
  .delete("/item/:item_id", isAuthorized(8), deleteInventoryItem)
