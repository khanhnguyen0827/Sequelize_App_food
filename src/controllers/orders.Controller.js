// Xử lý request HTTP và gọi đến lớp service tương ứng
import asyncHandler from '../common/utils/asyncHandler.js';
import ordersService from '../service/orders.service.js';

const createOrder = asyncHandler(async (req, res) => {
  const { userId, restaurantId, items } = req.body;
  if (!userId || !restaurantId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'User ID, Restaurant ID, and order items are required.' });
  }
  try {
    const newOrder = await ordersService.createOrder(userId, restaurantId, items);
    res.status(201).json({ message: 'Order created successfully.', data: newOrder });
  } catch (error) {
    // Bắt lỗi từ service (ví dụ: món ăn không tìm thấy)
    res.status(404).json({ message: error.message });
  }
});

const getOrdersByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const orders = await ordersService.getOrdersByUser(userId);
  res.status(200).json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await ordersService.getOrderById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }
  res.status(200).json(order);
});

export { createOrder, getOrdersByUser, getOrderById };
