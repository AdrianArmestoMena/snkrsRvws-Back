import "./loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import morgan from "morgan";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { app, startServer } from "./server/startServer";
import connectDB from "./database";

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
const debug = Debug("sneakers-reviews:index");

let mongoUrl = process.env.MONGODB;
if (process.env.NODE_ENV === "test") {
  mongoUrl = process.env.MONGODOB_TEST;
}

const port = process.env.PORT ?? 4000;

(async () => {
  await connectDB(mongoUrl);
  await startServer(port as number);
})();

app.use((req: Request, res: Response, next: NextFunction) => {
  debug(chalk.green(`A request has arrived to ${req.url}`));
  next();
});

export default app;
