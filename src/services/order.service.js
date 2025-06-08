import prisma from "../common/prisma/init.prisma.js";
import { BadrequestException } from "../common/helpers/exception.helper.js";

const orderService = {
/**
   * Thêm một đơn hàng mới.
   */
  addOrder: async (req) => {
    let { userId, foodItems } = req.body;
    userId=parseInt(userId);

      // Kiểm tra dữ liệu đầu vào cơ bản
      if (!userId || !foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
        throw new BadrequestException("Dữ liệu đơn hàng không hợp lệ. Cần userId và foodItems (mảng không rỗng).");
      }

      
      if (isNaN(userId)) {
        throw new BadrequestException("ID người dùng không hợp lệ.");
      }

      // Kiểm tra từng món ăn trong foodItems
      for (const item of foodItems) {
        if (typeof item !== 'object' || item === null || !item.foodId || !item.quantity) {
          throw new BadrequestException("Mỗi món ăn trong foodItems phải có foodId và quantity.");
        }
        const parsefoodId = parseInt(item.foodId);
        const parsequantity = parseInt(item.quantity);

        if (isNaN(parsefoodId) || isNaN(parsequantity) || parsequantity <= 0) {
          throw new BadrequestException(`Thông tin món ăn (ID: ${item.parsefoodId}) không hợp lệ: foodId hoặc quantity.`);
        }
        item.foodId = parsefoodId; // Cập nhật lại về số để truyền vào service
        item.quantity = parsequantity;
      }

    // 1. Kiểm tra sự tồn tại của người dùng
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new BadrequestException("Người dùng không tồn tại.");
    }

    if (!Array.isArray(foodItems) || foodItems.length === 0) {
      throw new BadrequestException("Đơn hàng phải chứa ít nhất một món ăn.");
    }

    let totalAmount = 0;
    const orderDetailsData = [];

    // 2. Duyệt qua từng món ăn để kiểm tra và tính toán tổng tiền
    for (const item of foodItems) {
      const foodId = item.foodId;
      const quantity = item.quantity;

      if (!foodId || !quantity || quantity <= 0) {
        throw new BadrequestException("Thông tin món ăn (foodId, quantity) không hợp lệ.");
      }

      const food = await prisma.foods.findUnique({ where: { food_id: foodId } });
      if (!food) {
        throw new BadrequestException(`Món ăn với ID ${foodId} không tồn tại.`);
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
  },

  /**
   * Lấy danh sách các đơn hàng của một người dùng.
   */
  getOrdersByUserId: async (req) => {

    const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        throw new BadrequestException("ID người dùng không hợp lệ.");
      }
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new BadrequestException("Người dùng không tồn tại.");
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
