
import prisma from "../common/prisma/init.prisma.js";
import { BadrequestException } from "../common/helpers/exception.helper.js";

const usersService = {
    getAllUsers: async () => {
    try {
      const users = await prisma.users.findMany();
      return users;
    } catch (error) {
      console.error("Lỗi trong UserService.getAllUsers:", error);
      throw new BadrequestException(`Không thể lấy danh sách người dùng.`);
    }
  },

  getUserById: async (userId) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          user_id: userId,
        },
      });
      return user;
    } catch (error) {
      console.error("Lỗi trong UserService.getUserById:", error);
      throw new BadrequestException(`Không thể lấy thông tin người dùng.`);
    }
  },

    
    getUserById: async(req) => {
        const userId = req.params.id;
        try {
            const user = await prisma.users.findUnique({
                where: { user_id: parseInt(userId) },
            });
            return user;
        } catch (error) {
            console.error("Error fetching user:", error);
           
            throw new BadrequestException(`Could not fetch user.`);
        }
    }
};

export default usersService;



