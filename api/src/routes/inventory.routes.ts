import { Router } from "express";
import { isAuthorized } from "../middlewares/isAuthorized";
import { addItemStock, addNewInventoryItem, createAmcItem, deleteInventoryItem, deleteSingleAmcItem, editItemInfo, getAmcListItems, getCurrentDateReport, getSingleAmcItem, getSingleInventoryItemInfo, updateAmcItem } from "../controllers/inventory.controller";

export const inventoryRoutes = Router();

inventoryRoutes
  .post("/amc", isAuthorized(13), createAmcItem)
  .put("/amc", isAuthorized(13), updateAmcItem)
  .delete("/amc", isAuthorized(13), deleteSingleAmcItem)
  .get("/amc", isAuthorized(13), getAmcListItems)
  .get("/amc/:id", isAuthorized(13), getSingleAmcItem)


  .post("/item/add", isAuthorized(8), addNewInventoryItem)
  .post("/item/stock/add", isAuthorized(8), addItemStock)
  .get("/item", isAuthorized(8), getCurrentDateReport)
  .put("/item/edit", isAuthorized(8), editItemInfo)
  .get("/item/:item_id", isAuthorized(8), getSingleInventoryItemInfo)
  .delete("/item/:item_id", isAuthorized(8), deleteInventoryItem)
