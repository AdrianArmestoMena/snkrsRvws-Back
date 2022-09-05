import { NextFunction, Request, Response } from "express";
import { Review } from "../../database/models/reviews";
import { IReview } from "../../types/review";
import createCustomError from "../../utils/error";

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const json = req.body.review;
  try {
    const review: IReview = JSON.parse(json);
    if (req.file) {
      review.picture = `uploads/${req.file.filename}`;
    }
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

export const getOwnerReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { owner } = req.params;
  try {
    const Reviews = await Review.find({ owner });

    res.status(200).json({ reviews: Reviews });
  } catch (error) {
    const newError = createCustomError(
      404,
      "No reviews found",
      "Could not get reviews"
    );
    next(newError);
  }
};
