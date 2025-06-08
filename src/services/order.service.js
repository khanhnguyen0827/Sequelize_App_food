import prisma from "../common/prisma/init.prisma.js";
import { BadrequestException } from "../common/helpers/exception.helper.js";

const orderService = {
/**
   * Thêm một đơn hàng mới.
   * @param {number} userId - ID của người dùng đặt hàng.
   * @param {Array<object>} foodItems - Mảng các món ăn trong đơn hàng, mỗi object { foodId: number, quantity: number }.
   * @returns {Promise<object>} - Đối tượng đơn hàng vừa tạo cùng với chi tiết.
   * @throws {BadRequestException} Nếu người dùng không tồn tại, món ăn không tồn tại hoặc số lượng không hợp lệ.
   */
  addOrder: async (userId, foodItems) => {
    // 1. Kiểm tra sự tồn tại của người dùng
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new BadRequestException("Người dùng không tồn tại.");
    }

    if (!Array.isArray(foodItems) || foodItems.length === 0) {
      throw new BadRequestException("Đơn hàng phải chứa ít nhất một món ăn.");
    }

    let totalAmount = 0;
    const orderDetailsData = [];

    // 2. Duyệt qua từng món ăn để kiểm tra và tính toán tổng tiền
    for (const item of foodItems) {
      const foodId = item.foodId;
      const quantity = item.quantity;

      if (!foodId || !quantity || quantity <= 0) {
        throw new BadRequestException("Thông tin món ăn (foodId, quantity) không hợp lệ.");
      }

      const food = await prisma.foods.findUnique({ where: { food_id: foodId } });
      if (!food) {
        throw new BadRequestException(`Món ăn với ID ${foodId} không tồn tại.`);
      }

      const itemPrice = food.price;
      totalAmount += itemPrice * quantity;

      orderDetailsData.push({
        food_id: foodId,
        quantity: quantity,
        price: itemPrice, // Lưu giá tại thời điểm đặt hàng
      });
    }

    // 3. Tạo đơn hàng và chi tiết đơn hàng trong một transaction
    // Transaction đảm bảo rằng cả order và order_details đều được tạo thành công,
    // hoặc không có gì được tạo nếu có lỗi.
    try {
      const order = await prisma.$transaction(async (prisma) => {
        const newOrder = await prisma.orders.create({
          data: {
            user_id: userId,
            order_date: new Date(),
            total_amount: totalAmount,
          },
        });

        // Liên kết order_details với newOrder
        const details = orderDetailsData.map(detail => ({
          ...detail,
          order_id: newOrder.order_id,
        }));

        await prisma.order_details.createMany({
          data: details,
        });

        return newOrder;
      });

      // Lấy lại đơn hàng với chi tiết để trả về
      const createdOrderWithDetails = await prisma.orders.findUnique({
        where: { order_id: order.order_id },
        include: {
          order_details: {
            include: {
              foods: {
                select: { food_id: true, food_name: true, price: true, image: true }
              }
            }
          }
        },
      });

      return createdOrderWithDetails;
    } catch (error) {
      console.error("Lỗi trong OrderService.addOrder:", error);
      // Nếu lỗi là do BadRequestException thì ném lại, nếu không thì là lỗi nội bộ
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error("Không thể thêm đơn hàng.");
    }
  },

  /**
   * Lấy danh sách các đơn hàng của một người dùng.
   * @param {number} userId - ID người dùng.
   * @returns {Promise<Array<object>>} - Mảng các đối tượng đơn hàng.
   * @throws {BadRequestException} Nếu người dùng không tồn tại.
   */
  getOrdersByUserId: async (userId) => {
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new BadRequestException("Người dùng không tồn tại.");
    }

    try {
      const orders = await prisma.orders.findMany({
        where: { user_id: userId },
        include: {
          order_details: {
            include: {
              foods: {
                select: { food_id: true, food_name: true, price: true, image: true }
              }
            }
          },
          users: {
            select: { user_id: true, full_name: true, email: true }
          }
        },
        orderBy: { order_date: 'desc' } // Sắp xếp theo ngày đặt giảm dần
      });
      return orders;
    } catch (error) {
      console.error("Lỗi trong OrderService.getOrdersByUserId:", error);
      throw new Error("Không thể lấy danh sách đơn hàng.");
    }
  },
};

export default orderService;
