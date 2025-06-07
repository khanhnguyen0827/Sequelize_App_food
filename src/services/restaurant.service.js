
import prisma from "../common/prisma/init.prisma";


const restaurantService = {// Like nhà hàng
    likeRestaurant: async (userId, resId) => {
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
                throw new Error("User has already liked this restaurant.");
            }
            console.error("Error liking restaurant:", error);
            throw new Error("Could not like restaurant.");
        }
    },

    // Unlike nhà hàng
    unlikeRestaurant: async (userId, resId) => {
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
                throw new Error("Like not found for this user and restaurant.");
            }
            console.error("Error unliking restaurant:", error);
            throw new Error("Could not unlike restaurant.");
        }
    },

    // Lấy danh sách like theo user_id
    getLikesByUserId: async (userId) => {
        try {
            const likes = await prisma.likes.findMany({
                where: { user_id: parseInt(userId) },
                include: { restaurants: true }, // Bao gồm thông tin nhà hàng
            });
            return likes;
        } catch (error) {
            console.error("Error fetching likes by user:", error);
            throw new Error("Could not fetch likes by user.");
        }
    },

    // Lấy danh sách like theo res_id
    getLikesByRestaurantId: async (resId) => {
        try {
            const likes = await prisma.likes.findMany({
                where: { res_id: parseInt(resId) },
                include: { users: true }, // Bao gồm thông tin người dùng
            });
            return likes;
        } catch (error) {
            console.error("Error fetching likes by restaurant:", error);
            throw new Error("Could not fetch likes by restaurant.");
        }
    },

    // Thêm đánh giá nhà hàng
    addRestaurantRating: async (userId, resId, amount) => {
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
            console.error("Error adding/updating restaurant rating:", error);
            throw new Error("Could not add/update restaurant rating.");
        }
    },

    // Lấy danh sách đánh giá theo user_id
    getRatingsByUserId: async (userId) => {
        try {
            const ratings = await prisma.rates.findMany({
                where: { user_id: parseInt(userId) },
                include: { restaurants: true },
            });
            return ratings;
        } catch (error) {
            console.error("Error fetching ratings by user:", error);
            throw new Error("Could not fetch ratings by user.");
        }
    },

    // Lấy danh sách đánh giá theo res_id
    getRatingsByRestaurantId: async (resId) => {
        try {
            const ratings = await prisma.rates.findMany({
                where: { res_id: parseInt(resId) },
                include: { users: true },
            });
            return ratings;
        } catch (error) {
            console.error("Error fetching ratings by restaurant:", error);
            throw new Error("Could not fetch ratings by restaurant.");
        }
    },


};

export default restaurantService;






