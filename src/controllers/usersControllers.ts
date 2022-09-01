import { NextFunction, Request, Response } from "express";
import { User } from "../database/models/users";
import { ReqUser, UserWithId } from "../types/user";
import { createToken, hashCompare, hashCreator } from "../utils/auth";
import createCustomError from "../utils/error";
import { Payload } from "../types/payload";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: ReqUser = req.body;

  try {
    user.password = await hashCreator(user.password.toString());

    const newUser = await User.create({
      userName: user.userName.toString(),
      email: user.email.toString(),
      password: user.password,
    });
    const statusCode = 201;

    res.status(statusCode).json({ newUser });
  } catch (error) {
    const errorCustom = createCustomError(
      400,
      "Failed on registration",
      "Failed on registration"
    );

    next(errorCustom);
  }
};

export const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body as { userName: string; password: string };

  user.userName.toString();
  user.password.toString();

  const errorCustom = createCustomError(
    400,
    "Authentication error",
    "Data does not fulfill contract"
  );

  let findUser: Array<UserWithId>;

  try {
    findUser = await User.find({
      userName: user.userName.toString(),
      pasword: user.password.toString(),
    });

    if (!findUser.length) {
      next(errorCustom);
      return;
    }
  } catch (error) {
    const customError = createCustomError(
      400,
      "Authentication error",
      "Could not fund user"
    );
    next(customError);
    return;
  }

  try {
    const isPaswordValid = await hashCompare(
      user.password,
      findUser[0].password
    );

    if (!isPaswordValid) {
      throw new Error();
    }
  } catch (error) {
    const customError = createCustomError(
      400,
      "Authentification error",
      "Not same password"
    );

    next(customError);
    return;
  }

  const userFinal: Payload = {
    userName: findUser[0].userName,
    id: findUser[0].id,
  };

  const responseData = {
    user: { token: createToken(userFinal) },
  };

  res.status(200).json(responseData);
};
