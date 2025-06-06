
import prisma from "../common/prisma/init.prisma.js";

const usersService = {
    getAll: async(req) => {
        
        const users = await prisma.users.findMany();
        return users;
    }
}    

export default usersService;



// async (req, res) => {
//     try {
//         const users = await prisma.users.findMany();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: error.message });
//     }
// }