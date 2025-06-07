
import express from "express";

import restaurantController from "../controllers/restaurant.controller.js";

const restaurantsRouter = express.Router();


// Xử lý like/unlike nhà hàng
restaurantsRouter.post('/like', restaurantController.likeRestaurant);
restaurantsRouter.post('/unlike', restaurantController.unlikeRestaurant);

// Lấy danh sách like
restaurantsRouter.get('/likes/user/:userId', restaurantController.getLikesByUserId);
restaurantsRouter.get('/likes/restaurant/:resId', restaurantController.getLikesByRestaurantId);

// Xử lý đánh giá nhà hàng
restaurantsRouter.post('/rate', restaurantController.addRestaurantRating);

// Lấy danh sách đánh giá
restaurantsRouter.get('/rates/user/:userId', restaurantController.getRatingsByUserId);
restaurantsRouter.get('/rates/restaurant/:resId', restaurantController.getRatingsByRestaurantId);

export default restaurantsRouter;