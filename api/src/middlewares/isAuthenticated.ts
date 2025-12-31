import { NextFunction, Response } from "express";
import asyncErrorHandler from "./asyncErrorHandler";
import { ErrorHandler } from "../utils/ErrorHandler";
import { verifyToken } from "../services/jwt";
import { getAuthToken } from "../utils/getAuthToken";
import { CustomRequest, IUserToken } from "../types";

export const isAuthenticated = asyncErrorHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = getAuthToken(req);
    
    if(!token) throw new ErrorHandler(401, "Unauthorized");

    const { data, error } = await verifyToken<IUserToken>(token);
    if (error) throw new ErrorHandler(401, "Unauthorized");

    req.user_info = data || undefined;

    next();
  }
);
