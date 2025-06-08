
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
   */
  getLikesByRestaurantId: async (req) => {

    const resId = parseInt(req.params.resId);

      if (isNaN(resId)) {
        throw new BadRequestException("ID nhà hàng không hợp lệ.");
      }
    const restaurant = await prisma.restaurants.findUnique({ where: { res_id: resId } });
    if (!restaurant) {
      throw new BadrequestException("Nhà hàng không tồn tại.");
    }

   
      const likes = await prisma.likes.findMany({
        where: { res_id: resId },
        include: {
          users: {
            select: { user_id: true, full_name: true, email: true } // Chọn các trường cần thiết của người dùng
          }
        },
      });
      return likes;
    
  },

  // =========================================================
  // Xử lý Đánh giá
  // =========================================================

  /**
   * Thêm hoặc cập nhật một đánh giá cho nhà hàng.
   */
  addRestaurantRating: async (req) => {
    let { userId, resId, amount } = req.body;

      userId = parseInt(userId);
      resId = parseInt(resId);
      amount = parseInt(amount);

      if (!userId || !resId || amount === undefined) {
        throw new BadRequestException("Thiếu user ID, restaurant ID hoặc điểm đánh giá.");
      }
     

      if (isNaN(userId) || isNaN(resId) || isNaN(amount)) {
        throw new BadRequestException("ID người dùng, ID nhà hàng hoặc điểm đánh giá không hợp lệ.");
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
    // Kiểm tra điểm đánh giá hợp lệ
    if (amount < 1 || amount > 5) { // Giả sử điểm đánh giá từ 1 đến 5
      throw new BadrequestException("Điểm đánh giá phải từ 1 đến 5.");
    }
   
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
    
  },

  /**
   * Lấy danh sách các lượt đánh giá của một người dùng.

   */
  getRatingsByUserId: async (req) => {
    const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        throw new BadRequestException("ID người dùng không hợp lệ.");
      }

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
   */
  getRatingsByRestaurantId: async (req) => {
    const resId = parseInt(req.params.resId);

      if (isNaN(resId)) {
        throw new BadRequestException("ID nhà hàng không hợp lệ.");
      }
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






