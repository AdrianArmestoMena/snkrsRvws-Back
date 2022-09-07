import express from "express";
import cors from "cors";
import morgan from "morgan";
import usersRouter from "./routers/usersRouter";
import { generalError, notFoundError } from "../middlewares/errors";
import reviewsRouter from "./routers/reviewsRouter";
import corsOptions from "../utils/corsOptions";

const app = express();

app.disable("x-powered-by");

app.use(cors(corsOptions));
app.use(morgan("dev"));

app.use(express.static("uploads"));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/reviews", reviewsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
