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

export const courseRoutes = Router();
courseRoutes
  .get("/session", getSession)
  .post("/session", createSession)
  .delete("/session/:id", deleteSession)
  .put("/session", updateSession)
  .get("/session/:id", getSingleSession)

  .post("/fee-head", createFeeHead)
  .put("/fee-head", updateFeeHead)
  .get("/fee-head", getFeeHeadList)
  .get("/fee-head/:id", getSingleFeeHead)

  // .post("/fee-structure", createFeeStructure)
  // .put("/fee-structure", updateFeeStructure)
  // .get("/fee-structure/:course_id", getFeeStructureList)
  // .delete("/fee-structure/:id", deleteFeeStructure)

  .post("/batch", createBatch)
  .get("/batch", getBatch)
  // .get("/batch/:id", getSingleBatch)
  .delete("/batch/:id", deleteBatch)
  .put("/batch", updateBatch)

  .post("/", createCourse)
  .get("/", getCourseList)
  .get("/dropdown", getCourseWithBatchSession)
  .get("/:id", getSingleCourse)
  .delete("/:id", deleteSingleCourse)
  .put("/", updateCourse)
