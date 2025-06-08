import usersService from "../services/user.service.js";
import { responseSeccess } from "../common/helpers/response.helper.js"; 
import { BadrequestException } from "../common/helpers/exception.helper.js";


const usersController = {

    getUserDetails: async (req, res) => {
        const user = await usersService.getUserById(req);
        const resdata = responseSeccess(user, "Lấy thông tin người dùng thành công");
        res.status(resdata.statusCode).json(resdata);   
  },


  getAllUsers: async (req, res) => {
    try {
      const users = await usersService.getAllUsers();
        const resdata = responseSeccess(users, "Lấy danh sách người dùng thành công");
        res.status(resdata.statusCode).json(resdata);   
    } catch (error) {
      console.error("Lỗi trong UserController.getAllUsers:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
    }
  }
};

export default usersController;






