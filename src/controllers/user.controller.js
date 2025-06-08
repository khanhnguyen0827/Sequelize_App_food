import usersService from "../services/user.service.js";
import { responseSeccess } from "../common/helpers/response.helper.js"; 
import { BadrequestException } from "../common/helpers/exception.helper.js";


const usersController = {

    getUserDetails: async (req, res) => {
    try {
      const userId = parseInt(req.params.user_id);

      if (isNaN(userId)) {
        console.error("ID người dùng không hợp lệ.");
        throw new BadrequestException(`ID người dùng không hợp lệ.`, 400);
       
      }

      const user = await userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng." });
      }

      const { password, ...userData } = user; // Loại bỏ mật khẩu
      res.status(200).json({
        message: "Lấy thông tin người dùng thành công",
        data: userData,
      });

    } catch (error) {
      console.error("Lỗi trong UserController.getUserDetails:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
    }
  },

  /**
   * Xử lý yêu cầu GET để lấy danh sách tất cả người dùng.
   * @param {object} req - Đối tượng Request từ Express.
   * @param {object} res - Đối tượng Response từ Express.
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();

      // Loại bỏ mật khẩu cho từng user trong danh sách
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userData } = user;
        return userData;
      });

      res.status(200).json({
        message: "Lấy danh sách người dùng thành công",
        data: usersWithoutPasswords,
      });

    } catch (error) {
      console.error("Lỗi trong UserController.getAllUsers:", error);
      res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
    }
  },
    getAll: async(req, res) => {
        try {
            const user = await usersService.getAll(req);
            const resdata = responseSeccess(user, "Get all articles successfully");
            res.status(resdata.statusCode).json(resdata);        

        } catch (error) {
            console.error("Error fetching articles:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

export default usersController;






