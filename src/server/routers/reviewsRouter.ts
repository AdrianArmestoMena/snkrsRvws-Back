import express from "express";
import multer from "multer";
import createReview from "../../controllers/reviews/reviewsController";

const reviewsRouter = express.Router();
const upload = multer({ dest: "uploads", limits: { fileSize: 3000000 } });

reviewsRouter.post("/addreview", upload.single("picture"), createReview);
export default reviewsRouter;
