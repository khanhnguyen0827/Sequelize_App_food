
import express from "express";
import restaurantsController from "../controllers/restaurants.controller";

const restaurantsRouter = express.Router();

// Lấy danh sách tất cả người dùng
restaurantsRouter.get('/', restaurantsController.getAll);

export default restaurantsRouter;