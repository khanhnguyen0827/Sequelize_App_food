// Định nghĩa các tuyến đường (routes) cho chức năng Like
import express from 'express';
const router = express.Router();
import { toggleLike, getLikesByRestaurant, getLikesByUser } from '../controllers/likes.Controller.js';

router.post('/', toggleLike);
router.get('/restaurant/:restaurantId', getLikesByRestaurant);
router.get('/user/:userId', getLikesByUser);
export default router;