import express from "express";
import { validate } from "express-validation";
import multer from "multer";
import {
  createReview,
  deleteReview,
  getbyBrand,
  getOneReview,
  getOwnerReviews,
  getReviews,
  updateReview,
} from "../../controllers/reviews/reviewsController";
import authentication from "../../middlewares/auth";
import parseData from "../../middlewares/parseData";
import supabaseUpload from "../../middlewares/supabase";
import reviewSchema from "../../schemas/reviewSchema";

const reviewsRouter = express.Router();
const upload = multer({ dest: "uploads", limits: { fileSize: 3000000 } });

reviewsRouter.post(
  "/addreview",
  authentication,
  upload.single("image"),
  parseData,
  supabaseUpload,
  validate(reviewSchema, {}, { abortEarly: false }),
  createReview
);
reviewsRouter.put(
  "/updatereview/:id",
  authentication,
  upload.single("image"),
  parseData,
  supabaseUpload,
  validate(reviewSchema, {}, { abortEarly: false }),
  updateReview
);
reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:owner", authentication, getOwnerReviews);
reviewsRouter.get("/bybrand/:brand", authentication, getbyBrand);
reviewsRouter.get("/onereview/:id", authentication, getOneReview);
reviewsRouter.delete("/:idReview", authentication, deleteReview);
export default reviewsRouter;
