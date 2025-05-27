// Chứa logic nghiệp vụ liên quan đến lượt thích và tương tác trực tiếp với Prisma
import prisma from '../common/prisma/init.prisma.js';

const likesService = {
  // Xử lý logic thích/bỏ thích nhà hàng
  toggleLike: async (userId, restaurantId) => {
    const existingLike = await prisma.like.findUnique({
      where: { userId_restaurantId: { userId: parseInt(userId), restaurantId: parseInt(restaurantId) } },
    });

    if (existingLike) {
      // Nếu đã thích, thực hiện bỏ thích (xóa)
      await prisma.like.delete({ where: { id: existingLike.id } });
      return { message: 'Unlike successful.', type: 'unlike' };
    } else {
      // Nếu chưa thích, thực hiện thích (thêm)
      const newLike = await prisma.like.create({ data: { userId: parseInt(userId), restaurantId: parseInt(restaurantId) } });
      return { message: 'Like successful.', type: 'like', data: newLike };
    }
  },

  // Lấy danh sách lượt thích theo ID nhà hàng
  getLikesByRestaurant: async (restaurantId) => {
    return prisma.like.findMany({
      where: { restaurantId: parseInt(restaurantId) },
      include: { user: { select: { id: true, username: true, email: true } } },
    });
  },

  // Lấy danh sách lượt thích theo ID người dùng
  getLikesByUser: async (userId) => {
    return prisma.like.findMany({
      where: { userId: parseInt(userId) },
      include: { restaurant: { select: { id: true, name: true, address: true } } },
    });
  },
};

export default likesService;