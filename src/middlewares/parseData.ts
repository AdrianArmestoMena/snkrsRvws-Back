import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import createCustomError from "../utils/error";

const parseData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newReview = req.body.review;

    const reviewObject = await JSON.parse(newReview);

    const newName = `${Date.now()}${req.file.originalname}`;
    reviewObject.picture = newName;

    await fs.rename(
      path.join("uploads", req.file.filename),
      path.join("uploads", newName)
    );

    reviewObject.picture = newName;

    req.body = reviewObject;

    next();
  } catch (error) {
    const customError = createCustomError(404, "Missing data", "Missing data");
    next(customError);
  }
};

export default parseData;
