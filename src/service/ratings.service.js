// Chứa logic nghiệp vụ liên quan đến đánh giá và tương tác trực tiếp với Prisma
import prisma from '../common/prisma/init.prisma.js';

const ratingsService = {
  // Thêm hoặc cập nhật đánh giá nhà hàng
  upsertRating: async (userId, restaurantId, rating, comment) => {
    return prisma.rating.upsert({
      where: { userId_restaurantId: { userId: parseInt(userId), restaurantId: parseInt(restaurantId) } },
      update: { rating: parseFloat(rating), comment: comment || null },
      create: { userId: parseInt(userId), restaurantId: parseInt(restaurantId), rating: parseFloat(rating), comment: comment || null },
    });
  },

  // Lấy danh sách đánh giá theo ID nhà hàng
  getRatingsByRestaurant: async (restaurantId) => {
    return prisma.rating.findMany({
      where: { restaurantId: parseInt(restaurantId) },
      include: { user: { select: { id: true, username: true, email: true } } },
    });
  },

  // Lấy danh sách đánh giá theo ID người dùng
  getRatingsByUser: async (userId) => {
    return prisma.rating.findMany({
      where: { userId: parseInt(userId) },
      include: { restaurant: { select: { id: true, name: true, address: true } } },
    });
  },
};

export default ratingsService;