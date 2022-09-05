import { Joi } from "express-validation";

const reviewSchema = {
  body: Joi.object({
    brand: Joi.string().required(),
    model: Joi.string().required(),
    picture: Joi.string(),
    review: Joi.string().required(),
    owner: Joi.string(),
  }),
};

export default reviewSchema;
