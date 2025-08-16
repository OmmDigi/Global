import { Router } from "express";
import {
  addNewVendorItem,
  deleteVendorItem,
  getSingleVendorInfo,
  // getVendorFiltersItemInfo,
  getVendorDropdown,
  getVendorList,
  updateVendorItem,
} from "../controllers/vendor.controller";
export const vendorRoute = Router();

vendorRoute
  .get("/", getVendorList)
  .get("/dropdown", getVendorDropdown)
  // .get("/vendor/filter-items", getVendorFiltersItemInfo)
  // .get("/vendor/item/:vendor_id", getItemOfVendor)
  .get("/:id", getSingleVendorInfo)
  .post("/", addNewVendorItem)
  // .post("/vendor/multi", addMultipleVendorItem)
  .put("/", updateVendorItem)
  .delete("/:id", deleteVendorItem);
