import { NextFunction, Request, Response } from "express";
import { User } from "../database/models/users";
import { ReqUser } from "../types/user";
import { hashCreator } from "../utils/auth";
import createCustomError from "../utils/error";

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const user: ReqUser = req.body;
  user.password = await hashCreator(user.password);
  try {
    const newUser = await User.create(user);
    res.status(201).json(newUser);
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
