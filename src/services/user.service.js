
import prisma from "../common/prisma/init.prisma.js";
import { BadrequestException } from "../common/helpers/exception.helper.js";

const usersService = {

  // Lấy danh sách người dùng
    getAllUsers: async () => {
    try {
      const users = await prisma.users.findMany();
      // Loại bỏ mật tự cho từng user trong danh sách
      users.forEach(user => delete user.password);
      return users;

    } catch (error) {
      console.error("Lỗi trong UserService.getAllUsers:", error);
      throw new BadrequestException(`Không thể lấy danh sách người dùng.`);
    }
  },

  // Lấy thống tin người dùng
  getUserById: async (req) => {
    const userId = parseInt(req.params.user_id);
    // Kiem tra tham so
      if (isNaN(userId)) {
        console.error("ID người dùng không hợp lệ.");
        throw new BadrequestException(`ID người dùng không hợp lệ.`);
      }
    try {
      const user = await prisma.users.findUnique({
        where: {
          user_id: userId,
        },
      });
       if (!user) {
        throw new BadrequestException(`Không tìm thấy người dùng.`);
      }
      // Loại bỏ mật khẩu cho từng user trong danh sách
      delete user.password;
      return user;
    } catch (error) {
      console.error("Lỗi trong UserService.getUserById:", error);
      throw new BadrequestException(`Không thể lấy thông tin người dùng.`);
    }
  }
};

export default usersService;



