import orderService from "../services/order.service.js";
import { responseSeccess } from "../common/helpers/response.helper.js";

const orderController = {
    // API để thêm order mới
    addOrder: async (req, res) => {
        const { userId, foodItems } = req.body; // foodItems là một mảng [{ food_id: ..., quantity: ... }]
        if (!userId || !foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
            return res.status(400).send('Missing userId or foodItems, or foodItems is empty/invalid.');
        }
        try {
            const newOrder = await orderService.addOrder(userId, foodItems);
            res.status(201).json({ message: 'Order placed successfully', data: newOrder });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // API để lấy danh sách order theo user ID
    getOrdersByUserId: async (req, res) => {
        const { userId } = req.params;
        try {
            const orders = await orderService.getOrdersByUserId(userId);
            res.status(200).json({ message: 'Orders fetched successfully', data: orders });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
};