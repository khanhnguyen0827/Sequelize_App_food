import restaurantsService from "../services/restaurants.service.js";
import { responseSeccess } from "../common/helpers/response.helper.js";

const restaurantsController = {
    getAll: async(req, res) => {
        try {
            const restaurants = await restaurantsService.getAll(req);
            const resdata = responseSeccess(restaurants, "Get all articles successfully");
            res.status(resdata.statusCode).json(resdata);        

        } catch (error) {
            console.error("Error fetching articles:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

};

export default restaurantsController;


