
import prisma from "../common/prisma/init.prisma.js";
import { BadrequestException } from "../common/helpers/exception.helper.js";

const usersService = {
    getAll: async(req) => {
        
        const users = await prisma.users.findMany();
        return users;
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



