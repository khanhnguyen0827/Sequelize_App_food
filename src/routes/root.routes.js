// Tập hợp tất cả các tuyến đường chính của API
import express from 'express';
const rootRouter = express.Router();

import likeRoutes from './like.routes.js';
import ratingRoutes from './ratings.routes.js';
import orderRoutes from './orders.routes.js';

// Gắn các tuyến đường con vào tuyến đường gốc /api
rootRouter.use('/likes', likeRoutes);
rootRouter.use('/ratings', ratingRoutes);
rootRouter.use('/orders', orderRoutes);
export default rootRouter;