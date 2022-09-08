import { model, Schema } from "mongoose";

export const reviews = new Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  backUpImage: {
    type: String,
  },
  review: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
  },
  likes: {
    type: [Schema.Types.ObjectId],
  },
  comments: {
    type: [Schema.Types.ObjectId],
  },
});

export const Review = model("Review", reviews, "reviews");
