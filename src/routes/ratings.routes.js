// Định nghĩa các tuyến đường (routes) cho chức năng Rating
import express from 'express';
const router = express.Router();
import { upsertRating, getRatingsByRestaurant, getRatingsByUser } from '../controllers/ratings.Controller.js';

router.post('/', upsertRating);
router.get('/restaurant/:restaurantId', getRatingsByRestaurant);
router.get('/user/:userId', getRatingsByUser);
export default router;
