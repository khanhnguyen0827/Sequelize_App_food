import express from "express";
import usersRouter from "./users.router";
import restaurantsRouter from "./restaurants.router";

const rootRouter = express.Router();

//api users
rootRouter.use('/users', usersRouter);
rootRouter.use('/restaurants', restaurantsRouter);


export default rootRouter;