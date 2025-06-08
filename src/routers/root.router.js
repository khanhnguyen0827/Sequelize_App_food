import express from "express";
import usersRouter from "./user.router";
import restaurantsRouter from "./restaurant.router";
import orderRouter from "./order.router";

const rootRouter = express.Router();

//api người dùng
rootRouter.use('/users', usersRouter);
//api nhà hàng
rootRouter.use('/restaurants', restaurantsRouter);
//api đơn hàng
rootRouter.use('/orders', orderRouter);


export default rootRouter;