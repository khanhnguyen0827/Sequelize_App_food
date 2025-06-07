import express from "express";
import usersRouter from "./user.router";
import restaurantsRouter from "./restaurant.router";

const rootRouter = express.Router();

//api lấy danh sách người dùng
rootRouter.use('/users', usersRouter);
//api lấy danh sách nhà hàng
rootRouter.use('/restaurants', restaurantsRouter);

rootRouter.use('/orders', ordersRouter);


/*
 * ===============================================
 * API XỬ LÝ LIKE NHÀ HÀNG
 * ===============================================
 */



export default rootRouter;