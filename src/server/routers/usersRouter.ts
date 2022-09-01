import express from "express";
import { validate } from "express-validation";
import { logIn, signUp } from "../../controllers/usersControllers";
import logInSchema from "../../schemas/logInChema";
import signUpSchema from "../../schemas/signUpSchema";

const usersRouter = express.Router();

usersRouter.post(
  "/signUp",
  validate(signUpSchema, {}, { abortEarly: false }),
  signUp
);
usersRouter.post(
  "/log-in",
  validate(logInSchema, {}, { abortEarly: false }),
  logIn
);

export default usersRouter;
