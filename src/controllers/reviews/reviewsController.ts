import { NextFunction, Request, Response } from "express";
import Debug from "debug";
import { Review } from "../../database/models/reviews";
import { IReview } from "../../types/review";
import createCustomError from "../../utils/error";

const debug = Debug("sneakers-reviews:controller-review");

export const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const review: IReview = req.body;
  try {
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

export const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const { brand, review, model, picture }: IReview = req.body;
  try {
    const reviewToEdit = await Review.findById({ _id: id });

    const reviewEdited = {
      brand,
      review,
      model,
      picture,
      owner: reviewToEdit.owner,
    };

    await Review.findByIdAndUpdate(id, reviewEdited);
    const newReview = await Review.findById(id);
    const statusCode = 201;
    res.status(statusCode).json({ newReview });
  } catch (error) {
    const errorCustom = createCustomError(
      400,
      "Fail updateing your reviews",
      "Could not update review"
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
  const { page = 1, limit = 1 } = req.query;

  try {
    const Reviews = await Review.find({ owner })
      .limit((limit as number) * 1)
      .skip(((page as number) - 1) * (limit as number))
      .exec();

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

export const getReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 1 } = req.query;
  try {
    const Reviews = await Review.find()
      .limit((limit as number) * 1)
      .skip(((page as number) - 1) * (limit as number))
      .exec();

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

export const getbyBrand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { brand } = req.params;
  try {
    const Reviews = await Review.find({ brand });

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

export const getOneReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const ReviewSelected = await Review.findById(id);

    res.status(200).json({ reviews: [ReviewSelected] });
  } catch (error) {
    const newError = createCustomError(
      404,
      "No reviews found",
      "Could not get reviews"
    );
    next(newError);
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { idReview } = req.params;

  try {
    const selectedReview = await Review.findById({ _id: idReview });

    if (!selectedReview) {
      const error = createCustomError(
        404,
        "No reviews found with the id",
        "Fail deleteing review, no reviews found"
      );
      next(error);
      return;
    }

    await Review.deleteOne({ _id: idReview });
    debug(`Deleted review with ID ${idReview}`);

    res.status(201).json({ selectedReview });
  } catch {
    const error = createCustomError(
      404,
      "Something went wrong",
      "Failed reuqest delet review"
    );
    next(error);
  }
};
