import prisma from "../common/prisma/init.prisma";
import { BadrequestException } from "../common/helpers/exception.helper.js";

const likeService = {
   

    likeRestaurant : async (req) => {

        const {userId, resId} = req.body
    // Kiểm tra xem user đã like nhà hàng này chưa
    const existingLike = await prisma.like_res.findFirst({
        where: {
            user_id: userId,
            res_id: resId,
        },
    });
    if (existingLike) {
        // Nếu đã like thì không làm gì hoặc báo lỗi
        throw new BadrequestException(`Restaurant already liked by this user.`);
    }

    const newLike = await prisma.like_res.create({
        data: {
            user_id: userId,
            res_id: resId,
            date_like: new Date(),
        },
    });
    return newLike;
},

// Service để xử lý logic bỏ like
unlikeRestaurant : async (req) => {
    // Tìm bản ghi like để xóa
    const {userId, resId} = req.body
    const likeToDelete = await prisma.like_res.findUnique({
        where: {
            user_id: userId,
            res_id: resId,
        },
    });

    if (!likeToDelete) {
        throw new BadrequestException(`Like record not found.`);
       
    }

    await prisma.like_res.delete({
        where: {
            like_id: likeToDelete.like_id,
        },
    });

    return { message: "Successfully unliked the restaurant." };
};

}


export default likeService

