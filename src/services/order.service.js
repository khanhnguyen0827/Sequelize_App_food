import prisma from "../common/prisma/init.prisma.js";
import { BadrequestException } from "../common/helpers/exception.helper.js";

const orderService = {

   addOrder: async (req) => {
     const { userId, foodItems } = req.body; // foodItems là một mảng [{ food_id: ..., quantity: ... }]
        // Kiem tra tham so
        if (!userId || !foodItems || !Array.isArray(foodItems) || foodItems.length === 0) {
            //nếu khong co tham so
            return res.status(400).json({ message: 'Missing userId or foodItems, or foodItems is empty/invalid.' });
        }
        // Kiểm tra từng foodItem
        for (const item of foodItems) {
            if (!item.food_id || !item.quantity || isNaN(item.food_id) || isNaN(item.quantity) || item.quantity <= 0) {
                console.log(item);
                return res.status(400).json({ message: 'Each food item must have a valid food_id and a positive quantity.' });// Trả về lỗi chi tiết hơn
            }
        }
         try {
           
            // Tính tổng số tiền
            let totalAmount = 0;
            // Giả định foodItems là một mảng các đối tượng { food_id: ..., quantity: ... }
            // Chúng ta cần lấy giá của từng món ăn từ database
            const foodIds = foodItems.map(item => item.food_id);
            const foodsData = await prisma.food.findMany({
                where: { food_id: { in: foodIds.map(id => parseInt(id)) } },
            });

            if (foodsData.length !== foodIds.length) {
                // Kiểm tra xem tất cả các món ăn được yêu cầu có tồn tại không
                const foundFoodIds = foodsData.map(f => f.food_id);
                const notFoundFoodIds = foodIds.filter(id => !foundFoodIds.includes(parseInt(id)));
                throw new Error(`Some food items not found: ${notFoundFoodIds.join(', ')}`);
            }

            const orderDetailsData = [];
            for (const item of foodItems) {
                const food = foodsData.find(f => f.food_id === parseInt(item.food_id));
                if (!food) { // Kiểm tra bổ sung, mặc dù đã kiểm tra ở trên
                    throw new Error(`Food with ID ${item.food_id} not found.`);
                }
                const itemPrice = parseFloat(food.price); // Đảm bảo price là số
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
                    Users: true, // Bao gồm thông tin user
                },
            });
            return newOrder;
        } catch (error) {
            console.error("Error adding order:", error);
            throw new Error(`Could not add order: ${error.message}`); // Truyền thông báo lỗi chi tiết hơn
        }
    },

    // Lấy danh sách order theo user_id (ví dụ)
    getOrdersByUserId: async (userId) => {
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
            console.error("Error fetching orders by user:", error);
            throw new Error("Could not fetch orders by user.");
        }
    }
};




export default orderService;

