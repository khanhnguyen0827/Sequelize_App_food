import express from "express";
import usersRouter from "./user.router";
import restaurantsRouter from "./restaurant.router";
import orderRouter from "./order.router";

const rootRouter = express.Router();

//api lấy danh sách người dùng
rootRouter.use('/user', usersRouter);
//api lấy danh sách nhà hàng
rootRouter.use('/restaurant', restaurantsRouter);

rootRouter.use('/order', orderRouter);


/*
 * ===============================================
 * API XỬ LÝ LIKE NHÀ HÀNG
 * ===============================================
 */



export default rootRouter;