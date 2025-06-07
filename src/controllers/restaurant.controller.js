import restaurantsService from "../services/restaurant.service.js";
import { responseSeccess } from "../common/helpers/response.helper.js";

const restaurantsController = {
   // API để like nhà hàng
    likeRestaurant: async (req, res) => {
        const { userId, resId } = req.body; // Giả định userId và resId được gửi trong body
        if (!userId || !resId) {
            return res.status(400).send('Missing userId or resId');
        }
        try {
            const newLike = await restaurantService.likeRestaurant(userId, resId);
            res.status(201).json({ message: 'Restaurant liked successfully', data: newLike });
        } catch (error) {
            if (error.message === "User has already liked this restaurant.") {
                return res.status(409).send(error.message); // Conflict
            }
            res.status(500).send(error.message);
        }
    },

    // API để unlike nhà hàng
    unlikeRestaurant: async (req, res) => {
        const { userId, resId } = req.body; // Giả định userId và resId được gửi trong body
        if (!userId || !resId) {
            return res.status(400).send('Missing userId or resId');
        }
        try {
            const deletedLike = await restaurantService.unlikeRestaurant(userId, resId);
            res.status(200).json({ message: 'Restaurant unliked successfully', data: deletedLike });
        } catch (error) {
            if (error.message === "Like not found for this user and restaurant.") {
                return res.status(404).send(error.message); // Not Found
            }
            res.status(500).send(error.message);
        }
    },

    // API để lấy danh sách like theo user ID
    getLikesByUserId: async (req, res) => {
        const { userId } = req.params; // Lấy userId từ URL params
        try {
            const likes = await restaurantService.getLikesByUserId(userId);
            res.status(200).json({ message: 'Likes fetched successfully', data: likes });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // API để lấy danh sách like theo restaurant ID
    getLikesByRestaurantId: async (req, res) => {
        const { resId } = req.params; // Lấy resId từ URL params
        try {
            const likes = await restaurantService.getLikesByRestaurantId(resId);
            res.status(200).json({ message: 'Likes fetched successfully', data: likes });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // API để thêm/cập nhật đánh giá nhà hàng
    addRestaurantRating: async (req, res) => {
        const { userId, resId, amount } = req.body;
        if (!userId || !resId || !amount) {
            return res.status(400).send('Missing userId, resId, or amount');
        }
        if (amount < 1 || amount > 5) {
            return res.status(400).send('Rating amount must be between 1 and 5.');
        }
        try {
            const newRating = await restaurantService.addRestaurantRating(userId, resId, amount);
            res.status(201).json({ message: 'Restaurant rating added/updated successfully', data: newRating });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // API để lấy danh sách đánh giá theo user ID
    getRatingsByUserId: async (req, res) => {
        const { userId } = req.params;
        try {
            const ratings = await restaurantService.getRatingsByUserId(userId);
            res.status(200).json({ message: 'Ratings fetched successfully', data: ratings });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },

    // API để lấy danh sách đánh giá theo restaurant ID
    getRatingsByRestaurantId: async (req, res) => {
        const { resId } = req.params;
        try {
            const ratings = await restaurantService.getRatingsByRestaurantId(resId);
            res.status(200).json({ message: 'Ratings fetched successfully', data: ratings });
        } catch (error) {
            res.status(500).send(error.message);
        }
    },
};

export default restaurantsController;


