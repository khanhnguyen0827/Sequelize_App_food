// Định nghĩa các tuyến đường (routes) cho chức năng Order
import express from 'express';
const router = express.Router();
import { createOrder, getOrdersByUser, getOrderById } from '../controllers/orders.Controller.js';

router.post('/', createOrder);
router.get('/user/:userId', getOrdersByUser);
router.get('/:orderId', getOrderById);
export default router;