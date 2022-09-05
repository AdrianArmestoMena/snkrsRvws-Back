import express from "express";
import { validate } from "express-validation";

import multer from "multer";
import {
  createReview,
  getOwnerReviews,
} from "../../controllers/reviews/reviewsController";
import authentication from "../../middlewares/auth";
import parseData from "../../middlewares/parseData";
import reviewSchema from "../../schemas/reviewSchema";

const reviewsRouter = express.Router();
const upload = multer({ dest: "uploads", limits: { fileSize: 3000000 } });

reviewsRouter.post(
  "/addreview",
  authentication,
  upload.single("image"),
  parseData,
  validate(reviewSchema, {}, { abortEarly: false }),
  createReview
);
reviewsRouter.get("/:owner", authentication, getOwnerReviews);
export default reviewsRouter;
