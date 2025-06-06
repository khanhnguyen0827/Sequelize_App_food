
import prisma from "../common/prisma/init.prisma";


const restaurantService = {
    likeRestaurant: async (req) => {
        const { userId, resId } = req.body;
        try {
            const newLike = await prisma.likes.create({
                data: {
                    user_id: parseInt(userId),
                    res_id: parseInt(resId),
                },
            });
            return newLike;
        } catch (error) {
            // Xử lý trường hợp đã like trước đó (unique constraint violation)
            if (error.code === 'P2002') {
                throw new BadrequestException(`User has already liked this restaurant.`);
            }
            throw new BadrequestException(`Could not like restaurant.`);
           
        }
    },

     // Unlike nhà hàng
    unlikeRestaurant: async (req) => {
        const { userId, resId } = req.body;
        try {
            const deletedLike = await prisma.likes.delete({
                where: {
                    user_id_res_id: { // Sử dụng khóa chính tổ hợp
                        user_id: parseInt(userId),
                        res_id: parseInt(resId),
                    },
                },
            });
            return deletedLike;
        } catch (error) {
            if (error.code === 'P2025') { // NotFoundError: Record to delete does not exist.
            throw new BadrequestException(`Like not found for this user and restaurant.`);
               
            }
            console.error("Error unliking restaurant:", error);
            throw new BadrequestException(`Could not unlike restaurant."`);
        }
    },
    // Lấy danh sách like theo user_id
    getLikesByUserId: async (req) => {
        const userId = req.params.id;
        try {
            const likes = await prisma.likes.findMany({
                where: { user_id: parseInt(userId) },
                include: { restaurants: true }, // Bao gồm thông tin nhà hàng
            });
            return likes;
        } catch (error) {
             throw new BadrequestException(`Could not fetch likes by user.`);
        }
    },

    // Lấy danh sách like theo res_id
    getLikesByRestaurantId: async (resId) => {
        const resId = req.params.id;
        try {
            const likes = await prisma.likes.findMany({
                where: { res_id: parseInt(resId) },
                include: { users: true }, // Bao gồm thông tin người dùng
            });
            return likes;
        } catch (error) {
             throw new BadrequestException(`Could not unlike restaurant."`);
        }
    },

    // Thêm đánh giá nhà hàng
    addRestaurantRating: async (req) => {
        const { userId, resId, amount } = req.body;
        try {
            const newRate = await prisma.rates.upsert({
                where: {
                    user_id_res_id: {
                        user_id: parseInt(userId),
                        res_id: parseInt(resId),
                    },
                },
                update: {
                    amount: parseInt(amount),
                    date_rate: new Date(), // Cập nhật thời gian đánh giá
                },
                create: {
                    user_id: parseInt(userId),
                    res_id: parseInt(resId),
                    amount: parseInt(amount),
                },
            });
            return newRate;
        } catch (error) {
           throw new BadrequestException(`Could not add/update restaurant rating.`);
           
        }
    },

    // Lấy danh sách đánh giá theo user_id
    getRatingsByUserId: async (req) => {
        const userId = req.params.id;
        try {
            const ratings = await prisma.rates.findMany({
                where: { user_id: parseInt(userId) },
                include: { restaurants: true },
            });
            return ratings;
        } catch (error) {
          
             throw new BadrequestException(`Could not fetch ratings by user.`);
          
        }
    },

    // Lấy danh sách đánh giá theo res_id
    getRatingsByRestaurantId: async (req) => {
        const resId = req.params.id;
        try {
            const ratings = await prisma.rates.findMany({
                where: { res_id: parseInt(resId) },
                include: { users: true },
            });
            return ratings;
        } catch (error) {
          
            throw new BadrequestException(`Could not fetch ratings by restaurant.`);
            
        }
    },



};

export default restaurantService;






