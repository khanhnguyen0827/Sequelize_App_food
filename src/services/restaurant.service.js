
import prisma from "../common/prisma/init.prisma";


const restaurantService = {// Like nhà hàng // =========================================================
  // Xử lý Like/Unlike
  // =========================================================

  /**
   * Thêm một lượt like cho nhà hàng.
   * @param {number} userId - ID người dùng.
   * @param {number} resId - ID nhà hàng.
   * @returns {Promise<object>} - Đối tượng like vừa tạo.
   * @throws {BadRequestException} Nếu người dùng hoặc nhà hàng không tồn tại, hoặc đã like.
   */
  likeRestaurant: async (userId, resId) => {
    // Kiểm tra sự tồn tại của người dùng và nhà hàng
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    const restaurant = await prisma.restaurants.findUnique({ where: { res_id: resId } });

    if (!user) {
      throw new BadRequestException("Người dùng không tồn tại.");
    }
    if (!restaurant) {
      throw new BadRequestException("Nhà hàng không tồn tại.");
    }

    // Kiểm tra xem đã like trước đó chưa
    const existingLike = await prisma.likes.findUnique({
      where: {
        user_id_res_id: {
          user_id: userId,
          res_id: resId,
        },
      },
    });

    if (existingLike) {
      throw new BadRequestException("Người dùng đã like nhà hàng này rồi.");
    }

    try {
      const newLike = await prisma.likes.create({
        data: {
          user_id: userId,
          res_id: resId,
          date_like: new Date(),
        },
      });
      return newLike;
    } catch (error) {
      console.error("Lỗi trong RestaurantService.likeRestaurant:", error);
      // Có thể là lỗi DB khác ngoài ràng buộc unique đã kiểm tra
      throw new Error("Không thể thêm lượt like.");
    }
  },

  /**
   * Xóa một lượt like của nhà hàng.
   * @param {number} userId - ID người dùng.
   * @param {number} resId - ID nhà hàng.
   * @returns {Promise<object>} - Đối tượng like vừa xóa.
   * @throws {BadRequestException} Nếu lượt like không tồn tại.
   */
  unlikeRestaurant: async (userId, resId) => {
    // Kiểm tra xem lượt like có tồn tại không
    const existingLike = await prisma.likes.findUnique({
      where: {
        user_id_res_id: {
          user_id: userId,
          res_id: resId,
        },
      },
    });

    if (!existingLike) {
      throw new BadRequestException("Người dùng chưa từng like nhà hàng này.");
    }

    try {
      const deletedLike = await prisma.likes.delete({
        where: {
          user_id_res_id: {
            user_id: userId,
            res_id: resId,
          },
        },
      });
      return deletedLike;
    } catch (error) {
      console.error("Lỗi trong RestaurantService.unlikeRestaurant:", error);
      throw new Error("Không thể xóa lượt like.");
    }
  },

  /**
   * Lấy danh sách các lượt like của một người dùng.
   * @param {number} userId - ID người dùng.
   * @returns {Promise<Array<object>>} - Mảng các đối tượng like.
   * @throws {BadRequestException} Nếu người dùng không tồn tại.
   */
  getLikesByUserId: async (userId) => {
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new BadRequestException("Người dùng không tồn tại.");
    }

    try {
      const likes = await prisma.likes.findMany({
        where: { user_id: userId },
        include: {
          restaurants: {
            select: { res_id: true, res_name: true, image: true, description: true } // Chọn các trường cần thiết của nhà hàng
          }
        },
      });
      return likes;
    } catch (error) {
      console.error("Lỗi trong RestaurantService.getLikesByUserId:", error);
      throw new Error("Không thể lấy danh sách like của người dùng.");
    }
  },

  /**
   * Lấy danh sách các lượt like của một nhà hàng.
   * @param {number} resId - ID nhà hàng.
   * @returns {Promise<Array<object>>} - Mảng các đối tượng like.
   * @throws {BadRequestException} Nếu nhà hàng không tồn tại.
   */
  getLikesByRestaurantId: async (resId) => {
    const restaurant = await prisma.restaurants.findUnique({ where: { res_id: resId } });
    if (!restaurant) {
      throw new BadRequestException("Nhà hàng không tồn tại.");
    }

    try {
      const likes = await prisma.likes.findMany({
        where: { res_id: resId },
        include: {
          users: {
            select: { user_id: true, full_name: true, email: true } // Chọn các trường cần thiết của người dùng
          }
        },
      });
      return likes;
    } catch (error) {
      console.error("Lỗi trong RestaurantService.getLikesByRestaurantId:", error);
      throw new Error("Không thể lấy danh sách like của nhà hàng.");
    }
  },

  // =========================================================
  // Xử lý Đánh giá
  // =========================================================

  /**
   * Thêm hoặc cập nhật một đánh giá cho nhà hàng.
   * @param {number} userId - ID người dùng.
   * @param {number} resId - ID nhà hàng.
   * @param {number} amount - Điểm đánh giá (ví dụ: 1-5).
   * @returns {Promise<object>} - Đối tượng đánh giá vừa tạo/cập nhật.
   * @throws {BadRequestException} Nếu người dùng/nhà hàng không tồn tại, hoặc điểm đánh giá không hợp lệ.
   */
  addRestaurantRating: async (userId, resId, amount) => {
    // Kiểm tra sự tồn tại của người dùng và nhà hàng
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    const restaurant = await prisma.restaurants.findUnique({ where: { res_id: resId } });

    if (!user) {
      throw new BadRequestException("Người dùng không tồn tại.");
    }
    if (!restaurant) {
      throw new BadRequestException("Nhà hàng không tồn tại.");
    }

    // Kiểm tra điểm đánh giá hợp lệ
    if (amount < 1 || amount > 5) { // Giả sử điểm đánh giá từ 1 đến 5
      throw new BadRequestException("Điểm đánh giá phải từ 1 đến 5.");
    }

    try {
      // Upsert: Nếu tồn tại thì update, không thì create
      const rating = await prisma.ratings.upsert({
        where: {
          user_id_res_id: {
            user_id: userId,
            res_id: resId,
          },
        },
        update: {
          amount: amount,
          date_rate: new Date(),
        },
        create: {
          user_id: userId,
          res_id: resId,
          amount: amount,
          date_rate: new Date(),
        },
      });
      return rating;
    } catch (error) {
      console.error("Lỗi trong RestaurantService.addRestaurantRating:", error);
      throw new Error("Không thể thêm hoặc cập nhật đánh giá.");
    }
  },

  /**
   * Lấy danh sách các lượt đánh giá của một người dùng.
   * @param {number} userId - ID người dùng.
   * @returns {Promise<Array<object>>} - Mảng các đối tượng đánh giá.
   * @throws {BadRequestException} Nếu người dùng không tồn tại.
   */
  getRatingsByUserId: async (userId) => {
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new BadRequestException("Người dùng không tồn tại.");
    }

    try {
      const ratings = await prisma.ratings.findMany({
        where: { user_id: userId },
        include: {
          restaurants: {
            select: { res_id: true, res_name: true, image: true, description: true }
          }
        },
      });
      return ratings;
    } catch (error) {
      console.error("Lỗi trong RestaurantService.getRatingsByUserId:", error);
      throw new Error("Không thể lấy danh sách đánh giá của người dùng.");
    }
  },

  /**
   * Lấy danh sách các lượt đánh giá của một nhà hàng.
   * @param {number} resId - ID nhà hàng.
   * @returns {Promise<Array<object>>} - Mảng các đối tượng đánh giá.
   * @throws {BadRequestException} Nếu nhà hàng không tồn tại.
   */
  getRatingsByRestaurantId: async (resId) => {
    const restaurant = await prisma.restaurants.findUnique({ where: { res_id: resId } });
    if (!restaurant) {
      throw new BadRequestException("Nhà hàng không tồn tại.");
    }

    try {
      const ratings = await prisma.ratings.findMany({
        where: { res_id: resId },
        include: {
          users: {
            select: { user_id: true, full_name: true, email: true }
          }
        },
      });
      return ratings;
    } catch (error) {
      console.error("Lỗi trong RestaurantService.getRatingsByRestaurantId:", error);
      throw new Error("Không thể lấy danh sách đánh giá của nhà hàng.");
    }
  }
  
};

export default restaurantService;






