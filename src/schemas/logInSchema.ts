import { Joi } from "express-validation";

const logInSchema = {
  body: Joi.object({
    userName: Joi.string().min(3).max(15).required(),
    password: Joi.string().min(5).required(),
  }),
};

export default logInSchema;
