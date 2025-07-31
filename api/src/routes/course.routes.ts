import { Router } from "express";
import {
  createBatch,
  createCourse,
  createSession,
  deleteBatch,
  deleteSession,
  deleteSingleCourse,
  getBatch,
  getCourseList,
  getSession,
  // getSingleBatch,
  getSingleCourse,
  getSingleSession,
  updateBatch,
  updateCourse,
  updateSession,
} from "../controllers/course.controller";

export const courseRoutes = Router();
courseRoutes
  .get("/session", getSession)
  .post("/session", createSession)
  .delete("/session/:id", deleteSession)
  .put("/session", updateSession)
  .get("/session/:id", getSingleSession)

  .post("/batch", createBatch)
  .get("/batch", getBatch)
  // .get("/batch/:id", getSingleBatch)
  .delete("/batch/:id", deleteBatch)
  .put("/batch", updateBatch)

  .post("/", createCourse)
  .get("/", getCourseList)
  .get("/:id", getSingleCourse)
  .delete("/:id", deleteSingleCourse)
  .put("/", updateCourse);
