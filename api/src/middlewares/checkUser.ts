import { NextFunction, Response } from "express";
import asyncErrorHandler from "./asyncErrorHandler";
import { verifyToken } from "../services/jwt";
import { getAuthToken } from "../utils/getAuthToken";
import { CustomRequest, IUserToken } from "../types";

export const checkUser = asyncErrorHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = getAuthToken(req);

    if (!token) {
      next();
      return;
    }

    const { data, error } = await verifyToken<IUserToken>(token);
    if (error) {
      next();
      return;
    }

    req.user_info = data || undefined;

    next();
  },
);
