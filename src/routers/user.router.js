import express from "express";
import usersController from "../controllers/user.controller";


const usersRouter = express.Router();


// Lấy danh sách tất cả người dùng
usersRouter.get('/', usersController.getAll);

// Lấy danh sách tất cả nhà hàng
// usersRouter.get('/api/restaurants', async (req, res) => {
//     try {
//         const restaurants = await prisma.restaurants.findMany();
//         res.status(200).json(restaurants);
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi khi lấy danh sách nhà hàng', error: error.message });
//     }
// });


export default usersRouter;

