import { NextFunction, Request, Response } from "express";
import { Review } from "../../database/models/reviews";
import { IReview } from "../../types/review";
import createCustomError from "../../utils/error";

const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const json = req.body.review;
  try {
    const review: IReview = JSON.parse(json);
    review.picture = `uploads\\${req.file.filename}`;
    const newReview = await Review.create(review);
    const statusCode = 201;

    res.status(statusCode).json({ newReview });
  } catch (error) {
    const errorCustom = createCustomError(
      400,
      "Fail creating your reviews",
      "Could not add review"
    );

    next(errorCustom);
  }
};

export default createReview;
