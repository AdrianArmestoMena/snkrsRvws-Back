import express from "express";
import signUp from "../../controllers/usersControllers";

const usersRouter = express.Router();

usersRouter.post("/signUp", signUp);

export default usersRouter;
