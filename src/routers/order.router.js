import express from "express";
import orderController from "../controllers/order.controller";  

const orderRouter = express.Router();

// User đặt món
orderRouter.post('/add', orderController.addOrder);

// Lấy danh sách order theo user ID (ví dụ)
orderRouter.get('/user/:userId', orderController.getOrdersByUserId);

export default orderRouter;