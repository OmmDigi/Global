import { NextFunction, Response } from "express";
import { ErrorHandler } from "../utils/ErrorHandler";
import { verifyToken } from "../services/jwt";
import asyncErrorHandler from "./asyncErrorHandler";
import { CustomRequest } from "../types";

export const verifySignedUrl = asyncErrorHandler(
  async (req: CustomRequest, _: Response, next: NextFunction) => {
    const urlToken = req.query.token?.toString();
    if (!urlToken) throw new ErrorHandler(403, "Invalid signed URL");

    const { error } = await verifyToken<{ route_id: number }>(urlToken);
    if (error) throw new ErrorHandler(401, "Invalid signed URL");

    next();
  }
)
