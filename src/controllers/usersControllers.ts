import { NextFunction, Request, Response } from "express";
import { User } from "../database/models/users";
import signUpSchema from "../schemas/signUpSchema";
import { ReqUser } from "../types/user";
import { hashCreator } from "../utils/auth";
import createCustomError from "../utils/error";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const user: ReqUser = req.body;

  try {
    const validation = signUpSchema.validate(user, {
      abortEarly: false,
    });

    if (validation.error) {
      throw new Error(Object.values(validation.error.message).join(""));
    }

    (validation.value as ReqUser).password = await hashCreator(user.password);

    const newUser = await User.create({
      userName: (validation.value as ReqUser).userName,
      email: (validation.value as ReqUser).email,
      password: (validation.value as ReqUser).password,
    });
    const statusCode = 201;

    res.status(statusCode).json(newUser);
  } catch (error) {
    const errorCustom = createCustomError(
      400,
      "Failed on registration",
      "Failed on registration"
    );

    next(errorCustom);
  }
};

export default signUp;
