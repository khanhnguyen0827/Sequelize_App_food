import orderService from "../services/order.service.js";
import { responseSeccess } from "../common/helpers/response.helper.js";

const orderController = {
    // =========================================================

      /**
   * Xử lý yêu cầu POST để thêm một đơn hàng mới.
   * Yêu cầu body: { userId: number, foodItems: [{ foodId: number, quantity: number }] }
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  addOrder: async (req, res) => {
    try {
      const { userId, foodItems } = req.body;

      // Kiểm tra dữ liệu đầu vào cơ bản
      if (!userId || !foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
        throw new BadRequestException("Dữ liệu đơn hàng không hợp lệ. Cần userId và foodItems (mảng không rỗng).");
      }

      const parsedUserId = parseInt(userId);
      if (isNaN(parsedUserId)) {
        throw new BadRequestException("ID người dùng không hợp lệ.");
      }

      // Kiểm tra từng món ăn trong foodItems
      for (const item of foodItems) {
        if (typeof item !== 'object' || item === null || !item.foodId || !item.quantity) {
          throw new BadRequestException("Mỗi món ăn trong foodItems phải có foodId và quantity.");
        }
        const parsedFoodId = parseInt(item.foodId);
        const parsedQuantity = parseInt(item.quantity);

        if (isNaN(parsedFoodId) || isNaN(parsedQuantity) || parsedQuantity <= 0) {
          throw new BadRequestException(`Thông tin món ăn (ID: ${item.foodId}) không hợp lệ: foodId hoặc quantity.`);
        }
        item.foodId = parsedFoodId; // Cập nhật lại về số để truyền vào service
        item.quantity = parsedQuantity;
      }

      const newOrder = await orderService.addOrder(parsedUserId, foodItems);
      res.status(201).json({
        message: "Đặt món thành công",
        data: newOrder,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Lỗi trong OrderController.addOrder:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ khi đặt món." });
    }
  },

  /**
   * Xử lý yêu cầu GET để lấy danh sách đơn hàng của một người dùng.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  getOrdersByUserId: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        throw new BadRequestException("ID người dùng không hợp lệ.");
      }

      const orders = await orderService.getOrdersByUserId(userId);
      res.status(200).json({
        message: "Lấy danh sách đơn hàng thành công",
        data: orders,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Lỗi trong OrderController.getOrdersByUserId:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ khi lấy đơn hàng." });
    }
  },
};

export default orderController;