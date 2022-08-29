import "../loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import express from "express";
import cors from "cors";

const debug = Debug("sneakers-reviews:index");

export const app = express();
app.disable("x-powered-by");

app.use(cors());

export const startServer = (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.blue("Server listening"));
      resolve(true);
    });

    server.on("error", (error) => {
      debug(chalk.yellow("Error connecting to database", error.message));
      reject(error);
    });
  });
