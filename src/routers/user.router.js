import express from "express";
import usersController from "../controllers/user.controller";


const usersRouter = express.Router();

// Lấy danh sách tất cả người dùng
usersRouter.get('/', usersController.getAllUsers);
// Lấy thống tin người dùng
usersRouter.get('/:user_id', usersController.getUserDetails);

export default usersRouter;

