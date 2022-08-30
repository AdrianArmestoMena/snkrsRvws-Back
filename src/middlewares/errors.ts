import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
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
  const errorStatus = error.statusCode;
  const publicErrorMessage = error.publicMessage ?? "General fucked up";
  const privateErrorMessage = error.privateMessage;

  debug(chalk.bgRedBright(privateErrorMessage));

  res.status(errorStatus).json({ error: publicErrorMessage });
};
