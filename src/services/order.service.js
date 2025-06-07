import prisma from "../common/prisma/init.prisma.js";
import { BadrequestException } from "../common/helpers/exception.helper.js";

const orderService = {
   
// Thêm một order mới
    // Thêm một order mới
    addOrder: async () => {
        const {userId, foodItems} = req.body;
        try {
            // Tính tổng số tiền
            let totalAmount = 0;
            // Giả định foodItems là một mảng các đối tượng { food_id: ..., quantity: ... }
            // Chúng ta cần lấy giá của từng món ăn từ database
            const foodIds = foodItems.map(item => item.food_id);
            const foodsData = await prisma.foods.findMany({
                where: { food_id: { in: foodIds.map(id => parseInt(id)) } },
            });

            if (foodsData.length !== foodIds.length) {
              
                 throw new BadrequestException(`Some food items not found.`);
            }

            const orderDetailsData = [];
            for (const item of foodItems) {
                const food = foodsData.find(f => f.food_id === parseInt(item.food_id));
                if (!food) {
                    
                     throw new BadrequestException(`Food with ID ${item.food_id} not found.`);
                }
                const itemPrice = parseFloat(food.price);
                totalAmount += itemPrice * item.quantity;
                orderDetailsData.push({
                    food_id: parseInt(item.food_id),
                    quantity: parseInt(item.quantity),
                    price: itemPrice,
                });
            }

            const newOrder = await prisma.orders.create({
                data: {
                    user_id: parseInt(userId),
                    total_amount: totalAmount,
                    order_details: {
                        create: orderDetailsData,
                    },
                },
                include: {
                    order_details: {
                        include: {
                            foods: true, // Bao gồm thông tin món ăn trong chi tiết order
                        },
                    },
                    users: true, // Bao gồm thông tin user
                },
            });
            return newOrder;
        } catch (error) {
           
             throw new BadrequestException(`Could not add order.`);
        }
    },

    // Lấy danh sách order theo user_id (ví dụ)
    getOrdersByUserId: async (req) => {

        const userId = req.params.id;
        try {
            const orders = await prisma.orders.findMany({
                where: { user_id: parseInt(userId) },
                include: {
                    order_details: {
                        include: {
                            foods: true,
                        },
                    },
                },
            });
            return orders;
        } catch (error) {
          
             throw new BadrequestException(`Could not fetch orders by user.`);
        }
    }
};




export default orderService;

