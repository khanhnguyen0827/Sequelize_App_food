import orderService from "../services/order.service.js";
import { responseSeccess } from "../common/helpers/response.helper.js";

const orderController = {
     // API để thêm order mới
    addOrder: async (req, res) => {
        
        
        try {
            // Thêm order
            const newOrder = await orderService.addOrder(req);
            res.status(201).json({ message: 'Order placed successfully', data: newOrder });
        } catch (error) {
            console.error("Error in addOrder controller:", error.message);
            res.status(500).json({ message: error.message || 'Could not add order.' }); // Trả về lỗi chi tiết hơn
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

export default orderController;