// Chứa logic nghiệp vụ liên quan đến đơn hàng và tương tác trực tiếp với Prisma
import prisma from '../common/prisma/init.prisma.js';

const ordersService = {
  // Tạo đơn hàng mới
  createOrder: async (userId, restaurantId, items) => {
    let totalAmount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const dish = await prisma.dish.findUnique({ where: { id: parseInt(item.dishId) } });
      if (!dish) {
        throw new Error(`Dish with ID ${item.dishId} not found.`); // Ném lỗi để controller bắt
      }
      const itemPrice = dish.price.toNumber();
      totalAmount += itemPrice * item.quantity;
      orderItemsData.push({
        dishId: parseInt(item.dishId),
        quantity: item.quantity,
        priceAtOrder: itemPrice,
      });
    }

    return prisma.order.create({
      data: {
        userId: parseInt(userId),
        restaurantId: parseInt(restaurantId),
        totalAmount: totalAmount,
        status: 'pending',
        orderItems: { create: orderItemsData },
      },
      include: {
        orderItems: { include: { dish: true } },
        user: { select: { id: true, username: true, email: true } },
        restaurant: { select: { id: true, name: true } },
      },
    });
  },

  // Lấy danh sách đơn hàng theo ID người dùng
  getOrdersByUser: async (userId) => {
    return prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: { restaurant: { select: { id: true, name: true, address: true } }, orderItems: { include: { dish: true } } },
      orderBy: { orderDate: 'desc' },
    });
  },

  // Lấy chi tiết một đơn hàng theo ID
  getOrderById: async (orderId) => {
    return prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: {
        user: { select: { id: true, username: true, email: true } },
        restaurant: { select: { id: true, name: true, address: true } },
        orderItems: { include: { dish: true } },
      },
    });
  },
};

export default ordersService;