import { Router } from "express";
import {
  createBatch,
  createCourse,
  createFeeHead,
  // createFeeStructure,
  createSession,
  deleteBatch,
  // deleteFeeStructure,
  deleteSession,
  deleteSingleCourse,
  getBatch,
  getCourseList,
  getCourseWithBatchSession,
  getFeeHeadList,
  // getFeeStructureList,
  getSession,
  // getSingleBatch,
  getSingleCourse,
  getSingleFeeHead,
  getSingleSession,
  updateBatch,
  updateCourse,
  updateFeeHead,
  // updateFeeStructure,
  updateSession,
} from "../controllers/course.controller";
import { isAuthorized } from "../middlewares/isAuthorized";

export const courseRoutes = Router();
courseRoutes
  .get("/session", isAuthorized(5), getSession)
  .post("/session", isAuthorized(5), createSession)
  .delete("/session/:id", isAuthorized(5), deleteSession)
  .put("/session", isAuthorized(5), updateSession)
  .get("/session/:id", isAuthorized(5), getSingleSession)

  .post("/fee-head", isAuthorized(5), createFeeHead)
  .put("/fee-head", isAuthorized(5), updateFeeHead)
  .get("/fee-head", isAuthorized(5), getFeeHeadList)
  .get("/fee-head/:id", isAuthorized(5), getSingleFeeHead)

  // .post("/fee-structure", createFeeStructure)
  // .put("/fee-structure", updateFeeStructure)
  // .get("/fee-structure/:course_id", getFeeStructureList)
  // .delete("/fee-structure/:id", deleteFeeStructure)

  .post("/batch", isAuthorized(5), createBatch)
  .get("/batch", isAuthorized(5), getBatch)
  // .get("/batch/:id", getSingleBatch)
  .delete("/batch/:id", isAuthorized(5), deleteBatch)
  .put("/batch", isAuthorized(5), updateBatch)

  .post("/", isAuthorized(5), createCourse)
  .get("/", isAuthorized(5), getCourseList)
  .get("/dropdown", getCourseWithBatchSession)
  .get("/:id", isAuthorized(5), getSingleCourse)
  .delete("/:id", isAuthorized(5), deleteSingleCourse)
  .put("/", isAuthorized(5), updateCourse);
