import { Router } from "express";
import {
  createUser,
  deleteUser,
  getOneUser,
  getUsersList,
  loginUser,
  updateUser,
} from "../controllers/users.controller";

export const usersRoutes = Router();

usersRoutes
  .post("/login", loginUser)
  .post("/create", createUser)
  .get("/:id", getOneUser)
  .get("/", getUsersList)
  .put("/", updateUser)
  .delete("/:id", deleteUser)
