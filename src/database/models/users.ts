import { model, Schema } from "mongoose";

export const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  contacts: {
    type: [Schema.Types.ObjectId],
  },
  reviews: {
    type: [Schema.Types.ObjectId],
  },
});

export const User = model("User", userSchema, "users");
