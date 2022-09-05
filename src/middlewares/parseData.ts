import { NextFunction, Request, Response } from "express";

const parseData = async (req: Request, res: Response, next: NextFunction) => {
  const newReview = req.body.review;

  const reviewObject = await JSON.parse(newReview);

  reviewObject.picture = req.file.filename;

  req.body = reviewObject;

  next();
};

export default parseData;
