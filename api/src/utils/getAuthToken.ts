import { Request } from "express";

export const getAuthToken = (req: Request) : string | null => {
  const authHeader = req.headers["authorization"];
  
  if(!authHeader) {
    if(req.cookies.refreshToken) return req.cookies.refreshToken;
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  return token;
};
