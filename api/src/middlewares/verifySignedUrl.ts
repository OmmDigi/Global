import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/ErrorHandler";
import { verifyToken } from "../services/jwt";
import asyncErrorHandler from "./asyncErrorHandler";

export const verifySignedUrl = asyncErrorHandler(
  async (req: Request, _: Response, next: NextFunction) => {
    const urlToken = req.query.token?.toString();
    if (!urlToken) throw new ErrorHandler(403, "Invalid signed URL");

    const { error } = await verifyToken(urlToken);
    if (error) throw new ErrorHandler(401, "Invalid signed URL");

    next();
  }
);
