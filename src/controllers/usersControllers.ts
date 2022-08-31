import { NextFunction, Request, Response } from "express";
import { User } from "../database/models/users";
import signUpSchema from "../schemas/signUpSchema";
import { ReqUser, UserWithId } from "../types/user";
import { createToken, hashCompare, hashCreator } from "../utils/auth";
import createCustomError from "../utils/error";
import { Payload } from "../types/payload";
import logInSchema from "../schemas/logInChema";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

export const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body as { userName: string; password: string };
  const errorCustom = createCustomError(
    400,
    "Authentication error",
    "Authentication error"
  );

  let findUser: Array<UserWithId>;

  try {
    const validation = logInSchema.validate(user, {
      abortEarly: false,
    });

    if (validation.error) {
      throw new Error(Object.values(validation.error.message).join(""));
    }
  } catch (error) {
    next(errorCustom);
    return;
  }

  try {
    findUser = await User.find({
      userName: user.userName,
      pasword: user.password,
    });

    if (!findUser.length) {
      next(errorCustom);
      return;
    }
  } catch (error) {
    const customError = createCustomError(
      400,
      (error as Error).message,
      "Authentication error"
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
      (error as Error).message,
      "Authentification error"
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
