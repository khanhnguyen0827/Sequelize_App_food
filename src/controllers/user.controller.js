import usersService from "../services/users.service.js";
import { responseSeccess } from "../common/helpers/response.helper.js"; 


const usersController = {
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






async (req, res) => {
    try {
        const users = await prisma.users.findMany();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: error.message });
    }
}