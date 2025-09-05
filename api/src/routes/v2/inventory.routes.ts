import { Router } from "express";
import { addInventoryItemStockV2, addInventoryItemV2, deleteInventoryItemV2, getInventoryItemInfo, getSingleInventoryItemInfo, updateInventoryItemInfoV2 } from "../../controllers/v2/inventory.controller";
import { isAuthorized } from "../../middlewares/isAuthorized";

export const inventoryRouteV2 = Router();

inventoryRouteV2
    .put("/item" , isAuthorized(8), updateInventoryItemInfoV2)
    .post("/item", isAuthorized(8), addInventoryItemV2)
    .post("/item/stock", isAuthorized(8), addInventoryItemStockV2)
    .delete("/item", isAuthorized(8), deleteInventoryItemV2)

    .get("/item", getInventoryItemInfo)
    .get("/item/:id", isAuthorized(8), getSingleInventoryItemInfo)