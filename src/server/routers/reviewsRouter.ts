import express from "express";
import multer from "multer";
import {
  createReview,
  getOwnerReviews,
} from "../../controllers/reviews/reviewsController";

const reviewsRouter = express.Router();
const upload = multer({ dest: "uploads", limits: { fileSize: 3000000 } });

reviewsRouter.post("/addreview", upload.single("picture"), createReview);
reviewsRouter.get("/:owner", getOwnerReviews);
export default reviewsRouter;
