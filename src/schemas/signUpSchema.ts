import { Joi } from "express-validation";

const signUpSchema = Joi.object({
  userName: Joi.string().min(3).max(15).required(),
  password: Joi.string().min(5).required(),
  email: Joi.string().min(7).required(),
});

export default signUpSchema;
