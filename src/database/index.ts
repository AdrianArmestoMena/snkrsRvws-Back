import "../loadEnvironment";
import Debug from "debug";
import chalk from "chalk";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

const debug = Debug("sneakers-reviews:index");

export const app = express();
app.use(cors());

const connectDB = (mongoUrl: string) =>
  new Promise((resolve, reject) => {
    mongoose.connect(mongoUrl, (error) => {
      if (error) {
        debug(chalk.bgRed("Error connecting to Database"));
        reject(error);
        return;
      }
      debug(chalk.bgGreen("Connected to Database"));
      resolve(true);
      mongoose.set("toJSON", {
        virtuals: true,
        transform: (doc, ret) => {
          const newDocument = { ...ret };
          // eslint-disable-next-line no-underscore-dangle
          delete newDocument.__v;
          // eslint-disable-next-line no-underscore-dangle
          delete newDocument._id;
          delete newDocument.password;
          return newDocument;
        },
      });
    });
  });

export default connectDB;
