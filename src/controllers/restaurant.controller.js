import restaurantService from "../services/restaurant.service.js";
import { responseSeccess } from "../common/helpers/response.helper.js";

const restaurantsController = {
    // =========================================================
  // Xử lý Like/Unlike
  // =========================================================

  /**
   * Xử lý yêu cầu POST để like một nhà hàng.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  likeRestaurant: async (req, res) => {
      const newLike = await restaurantService.likeRestaurant(req.body);
        const resdata = responseSeccess(newLike, "Like nhà hàng thành công");
        res.status(resdata.statusCode).json(resdata);  
  },

  /**
   * Xử lý yêu cầu POST để unlike một nhà hàng.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  unlikeRestaurant: async (req, res) => {
    try {
      const { userId, resId } = req.body;

      if (!userId || !resId) {
        throw new BadRequestException("Thiếu user ID hoặc restaurant ID.");
      }
      const parsedUserId = parseInt(userId);
      const parsedResId = parseInt(resId);

      if (isNaN(parsedUserId) || isNaN(parsedResId)) {
        throw new BadRequestException("ID người dùng hoặc nhà hàng không hợp lệ.");
      }

      const deletedLike = await restaurantService.unlikeRestaurant(parsedUserId, parsedResId);
      res.status(200).json({
        message: "Unlike nhà hàng thành công",
        data: deletedLike,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Lỗi trong RestaurantController.unlikeRestaurant:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ khi unlike nhà hàng." });
    }
  },

  /**
   * Xử lý yêu cầu GET để lấy danh sách like theo user ID.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  getLikesByUserId: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        throw new BadRequestException("ID người dùng không hợp lệ.");
      }

      const likes = await restaurantService.getLikesByUserId(userId);
      res.status(200).json({
        message: "Lấy danh sách like của người dùng thành công",
        data: likes,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Lỗi trong RestaurantController.getLikesByUserId:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ khi lấy danh sách like." });
    }
  },

  /**
   * Xử lý yêu cầu GET để lấy danh sách like theo restaurant ID.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  getLikesByRestaurantId: async (req, res) => {
    try {
      const resId = parseInt(req.params.resId);

      if (isNaN(resId)) {
        throw new BadRequestException("ID nhà hàng không hợp lệ.");
      }

      const likes = await restaurantService.getLikesByRestaurantId(resId);
      res.status(200).json({
        message: "Lấy danh sách like của nhà hàng thành công",
        data: likes,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Lỗi trong RestaurantController.getLikesByRestaurantId:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ khi lấy danh sách like." });
    }
  },

  // =========================================================
  // Xử lý Đánh giá
  // =========================================================

  /**
   * Xử lý yêu cầu POST để thêm/cập nhật đánh giá nhà hàng.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  addRestaurantRating: async (req, res) => {
    try {
      const { userId, resId, amount } = req.body;

      if (!userId || !resId || amount === undefined) {
        throw new BadRequestException("Thiếu user ID, restaurant ID hoặc điểm đánh giá.");
      }
      const parsedUserId = parseInt(userId);
      const parsedResId = parseInt(resId);
      const parsedAmount = parseInt(amount); // Đảm bảo amount là số

      if (isNaN(parsedUserId) || isNaN(parsedResId) || isNaN(parsedAmount)) {
        throw new BadRequestException("ID người dùng, ID nhà hàng hoặc điểm đánh giá không hợp lệ.");
      }

      const rating = await restaurantService.addRestaurantRating(parsedUserId, parsedResId, parsedAmount);
      res.status(201).json({
        message: "Đánh giá nhà hàng thành công",
        data: rating,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Lỗi trong RestaurantController.addRestaurantRating:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ khi đánh giá nhà hàng." });
    }
  },

  /**
   * Xử lý yêu cầu GET để lấy danh sách đánh giá theo user ID.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  getRatingsByUserId: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      if (isNaN(userId)) {
        throw new BadRequestException("ID người dùng không hợp lệ.");
      }

      const ratings = await restaurantService.getRatingsByUserId(userId);
      res.status(200).json({
        message: "Lấy danh sách đánh giá của người dùng thành công",
        data: ratings,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Lỗi trong RestaurantController.getRatingsByUserId:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ khi lấy danh sách đánh giá." });
    }
  },

  /**
   * Xử lý yêu cầu GET để lấy danh sách đánh giá theo restaurant ID.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  getRatingsByRestaurantId: async (req, res) => {
    try {
      const resId = parseInt(req.params.resId);

      if (isNaN(resId)) {
        throw new BadRequestException("ID nhà hàng không hợp lệ.");
      }

      const ratings = await restaurantService.getRatingsByRestaurantId(resId);
      res.status(200).json({
        message: "Lấy danh sách đánh giá của nhà hàng thành công",
        data: ratings,
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("Lỗi trong RestaurantController.getRatingsByRestaurantId:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ khi lấy danh sách đánh giá." });
    }
  },
};

export default restaurantsController;


