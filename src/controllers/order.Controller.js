import orderService from "../services/order.service.js";
import { responseSeccess } from "../common/helpers/response.helper.js";

const orderController = {
    // =========================================================

      /**
   * Xử lý yêu cầu POST để thêm một đơn hàng mới.
   * Yêu cầu body: { userId: number, foodItems: [{ foodId: number, quantity: number }] }
   */
  addOrder: async (req, res) => {
    const newOrder = await orderService.addOrder(req);
    const resdata = responseSeccess(newOrder, "Đặt món thành công");
    res.status(resdata.statusCode).json(resdata); 
  },

  /**
   * Xử lý yêu cầu GET để lấy danh sách đơn hàng của một người dùng.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  getOrdersByUserId: async (req, res) => {
    const orders = await orderService.getOrdersByUserId(req);
    const resdata = responseSeccess(orders, "Lấy danh sách đơn hàng thành công");
    res.status(resdata.statusCode).json(resdata); 
  },
};

export default orderController;