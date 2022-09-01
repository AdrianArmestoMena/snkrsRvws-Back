import "./loadEnvironment";
import Debug from "debug";
import chalk from "chalk";

import connectDB from "./database";
import startServer from "./server/startServer";

const debug = Debug("sneakers-reviews:index");

const port = +process.env.PORT ?? 4000;
const database = process.env.MONGODB;

(async () => {
  debug(chalk.gray("Starting server and connecting to the database"));
  try {
    await connectDB(database);
    await startServer(port);
  } catch (error) {
    debug(chalk.red("Error while starting the server and the database"));
    process.exit(5);
  }
})();
