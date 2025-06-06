
import prisma from "../common/prisma/init.prisma";


const restaurantsService = {
    getAll: async(req) => {
        
        const restaurants = await prisma.restaurants.findMany();
        return restaurants;
    }
};

export default restaurantsService;






