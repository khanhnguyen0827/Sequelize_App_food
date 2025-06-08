
import prisma from "../common/prisma/init.prisma";
import { BadrequestException } from "../common/helpers/exception.helper.js";

const restaurantService = {// Like nhà hàng // =========================================================
  // Xử lý Like/Unlike
  
  likeRestaurant: async (req) => {

    const { userId, resId } = req.body; // Lấy userId và resId từ body

    const parsedUserId = parseInt(userId);
    const parsedResId = parseInt(resId);

     // Kiểm tra dữ liệu đầu vào
      if (!userId || !resId) {
        throw new BadrequestException("Thiếu user ID hoặc restaurant ID.");
        
      }
      

      if (isNaN(parsedUserId) || isNaN(parsedResId)) {
        throw new BadrequestException("ID người dùng hoặc nhà hàng không hợp lệ.");
      }

    // Kiểm tra sự tồn tại của người dùng và nhà hàng
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    const restaurant = await prisma.restaurants.findUnique({ where: { res_id: resId } });

    if (!user) {
      throw new BadrequestException("Người dùng không tồn tại.");
      
    }
    if (!restaurant) {
      throw new BadrequestException("Nhà hàng không tồn tại.");
      
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
      throw new BadrequestException("Người dùng đã like nhà hàng này rồi.");
      
    }

    
      const newLike = await prisma.likes.create({
        data: {
          user_id: userId,
          res_id: resId,
          date_like: new Date(),
        },
      });
      return newLike;
    
  },

  /**
   * Xóa một lượt like của nhà hàng.
   */
  unlikeRestaurant: async (req) => {
    let  { userId, resId } = req.body;

    userId = parseInt(userId);
    resId = parseInt(resId);

      if (!userId || !resId) {
        throw new BadRequestException("Thiếu user ID hoặc restaurant ID.");
      }
      if (isNaN(userId) || isNaN(resId)) {
        throw new BadRequestException("ID người dùng hoặc nhà hàng không hợp lệ.");
      }

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
      throw new BadrequestException("Người dùng chưa từng like nhà hàng này.");
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
   */
  getLikesByUserId: async (req) => {

     const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        throw new BadRequestException("ID người dùng không hợp lệ.");
      }

    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new BadrequestException("Người dùng không tồn tại.");
    }

      const likes = await prisma.likes.findMany({
        where: { user_id: userId },
        include: {
          restaurants: {
            select: { res_id: true, res_name: true, image: true, description: true } // Chọn các trường cần thiết của nhà hàng
          }
        },
      });
      return likes;
  },

  /**
   * Lấy danh sách các lượt like của một nhà hàng.
   * @param {number} resId - ID nhà hàng.
   * @returns {Promise<Array<object>>} - Mảng các đối tượng like.
   * @throws {BadrequestException} Nếu nhà hàng không tồn tại.
   */
  getLikesByRestaurantId: async (resId) => {
    const restaurant = await prisma.restaurants.findUnique({ where: { res_id: resId } });
    if (!restaurant) {
      throw new BadrequestException("Nhà hàng không tồn tại.");
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
   * @throws {BadrequestException} Nếu người dùng/nhà hàng không tồn tại, hoặc điểm đánh giá không hợp lệ.
   */
  addRestaurantRating: async (userId, resId, amount) => {
    // Kiểm tra sự tồn tại của người dùng và nhà hàng
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    const restaurant = await prisma.restaurants.findUnique({ where: { res_id: resId } });

    if (!user) {
      throw new BadrequestException("Người dùng không tồn tại.");
    }
    if (!restaurant) {
      throw new BadrequestException("Nhà hàng không tồn tại.");
    }

    // Kiểm tra điểm đánh giá hợp lệ
    if (amount < 1 || amount > 5) { // Giả sử điểm đánh giá từ 1 đến 5
      throw new BadrequestException("Điểm đánh giá phải từ 1 đến 5.");
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
   * @throws {BadrequestException} Nếu người dùng không tồn tại.
   */
  getRatingsByUserId: async (userId) => {
    const user = await prisma.users.findUnique({ where: { user_id: userId } });
    if (!user) {
      throw new BadrequestException("Người dùng không tồn tại.");
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
   * @throws {BadrequestException} Nếu nhà hàng không tồn tại.
   */
  getRatingsByRestaurantId: async (resId) => {
    const restaurant = await prisma.restaurants.findUnique({ where: { res_id: resId } });
    if (!restaurant) {
      throw new BadrequestException("Nhà hàng không tồn tại.");
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






