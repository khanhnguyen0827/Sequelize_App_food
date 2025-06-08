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
      const newLike = await restaurantService.likeRestaurant(req);
        const resdata = responseSeccess(newLike, "Like nhà hàng thành công");
        res.status(resdata.statusCode).json(resdata);  
  },

  /**
   * Xử lý yêu cầu POST để unlike một nhà hàng.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  unlikeRestaurant: async (req, res) => {
      const deletedLike = await restaurantService.unlikeRestaurant(req);
       const resdata = responseSeccess(deletedLike, "Unlike nhà hàng thành công");
        res.status(resdata.statusCode).json(resdata);  
  },

  /**
   * Xử lý yêu cầu GET để lấy danh sách like theo user ID.
   */
  getLikesByUserId: async (req, res) => {

      const likes = await restaurantService.getLikesByUserId(req);
    const resdata = responseSeccess(likes, "Lấy danh sách like của người dùng thành công");
    res.status(resdata.statusCode).json(resdata);  
  },

  /**
   * Xử lý yêu cầu GET để lấy danh sách like theo restaurant ID.

   */
  getLikesByRestaurantId: async (req, res) => {
      const likes = await restaurantService.getLikesByRestaurantId(req);
    const resdata = responseSeccess(likes, "Lấy danh sách like của nhà hàng thành công");
    res.status(resdata.statusCode).json(resdata);  
  },

  // =========================================================
  // Xử lý Đánh giá
  // =========================================================

  /**
   * Xử lý yêu cầu POST để thêm/cập nhật đánh giá nhà hàng.
 
   */
  addRestaurantRating: async (req, res) => {
      const rating = await restaurantService.addRestaurantRating(req);
    const resdata = responseSeccess(rating, "Đánh giá nhà hàng thành công");
    res.status(resdata.statusCode).json(resdata);  
  },

  /**
   * Xử lý yêu cầu GET để lấy danh sách đánh giá theo user ID.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  getRatingsByUserId: async (req, res) => {
    const ratings = await restaurantService.getRatingsByUserId(req);
    const resdata = responseSeccess(ratings, "Lấy danh sách đánh giá của người dùng thành công");
    res.status(resdata.statusCode).json(resdata);  
  },

  /**
   * Xử lý yêu cầu GET để lấy danh sách đánh giá theo restaurant ID.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  getRatingsByRestaurantId: async (req, res) => {
    const ratings = await restaurantService.getRatingsByRestaurantId(req);
    const resdata = responseSeccess(ratings, "Lấy danh sách đánh giá của nhà hàng thành công");
    res.status(resdata.statusCode).json(resdata); 
    
  },
};

export default restaurantsController;


