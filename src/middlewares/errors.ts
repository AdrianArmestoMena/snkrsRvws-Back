import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import Customerror from "../types/error";

const debug = Debug("sneakers-reviews:errors");

export const notFoundError = (req: Request, res: Response) => {
  const error = { error: "Endpoint Not Found" };
  res.status(404).json(error);
};

export const generalError = (
  error: Customerror,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let errorStatus = error.statusCode;
  let publicErrorMessage = error.publicMessage ?? "General fucked up";
  let privateErrorMessage = error.privateMessage;

  if (error instanceof ValidationError) {
    errorStatus = 400;
    publicErrorMessage = "Invalid data";
    privateErrorMessage = "Invalid data!";
    debug(chalk.blue("Invalidation request data:"));

    error.details.body.forEach((errorInfo) => {
      debug(chalk.yellowBright(errorInfo.message));
    });
  }

  debug(chalk.bgRedBright(privateErrorMessage));

  res.status(errorStatus).json({ error: publicErrorMessage });
};
