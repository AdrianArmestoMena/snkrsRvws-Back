import { NextFunction, Request, Response } from "express";
import createCustomError from "../utils/error";

const parseData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newReview = req.body.review;

    const reviewObject = await JSON.parse(newReview);

    reviewObject.picture = req.file.filename;

    req.body = reviewObject;

    next();
  } catch (error) {
    const customError = createCustomError(404, "Missing data", "Missing data");
    next(customError);
  }
};

export default parseData;
