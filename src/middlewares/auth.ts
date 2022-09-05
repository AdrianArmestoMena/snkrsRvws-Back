import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/interfaces";
import { verifyToken } from "../utils/auth";
import createCustomError from "../utils/error";

const authentication = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const error = createCustomError(400, "Bad request", "Authentication Error");
  const dataAuthentication = req.get("authorization");

  if (!dataAuthentication || !dataAuthentication.startsWith("Bearer")) {
    next(error);
    return;
  }

  const token = dataAuthentication.slice(7);
  const tokenData = verifyToken(token);

  if (typeof tokenData === "string") {
    next(error);
    return;
  }

  req.payload = tokenData;
  next();
};
export default authentication;
