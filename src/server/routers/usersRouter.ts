import express from "express";
import { validate } from "express-validation";
import { logIn, signUp } from "../../controllers/users/usersControllers";
import logInSchema from "../../schemas/logInSchema";
import signUpSchema from "../../schemas/signUpSchema";

const usersRouter = express.Router();

usersRouter.post(
  "/signup",
  validate(signUpSchema, {}, { abortEarly: false }),
  signUp
);
usersRouter.post(
  "/login",
  validate(logInSchema, {}, { abortEarly: false }),
  logIn
);

export default usersRouter;
