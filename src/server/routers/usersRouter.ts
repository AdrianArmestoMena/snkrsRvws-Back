import express from "express";
import { logIn, signUp } from "../../controllers/usersControllers";

const usersRouter = express.Router();

usersRouter.post("/signUp", signUp);
usersRouter.post("/log-in", logIn);
export default usersRouter;
