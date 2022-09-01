import "../loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import app from ".";

const debug = Debug("sneakers-reviews:index");

const startServer = (port: number) =>
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

export default startServer;
