import { NextFunction, Request, Response } from "express";
import { User } from "../database/models/users";
import { ReqUser } from "../types/user";
import { hashCreator } from "../utils/auth";
import createCustomError from "../utils/error";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const user: ReqUser = req.body;

  user.password = await hashCreator(user.password);
  user.userName = user.userName.toString();
  user.email = user.email.toString();

  try {
    const statusCode = 201;
    const newUser = await User.create(user);

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
