import expess from "express";
import { PORT } from "./src/common/constant/app.constant";
import rootRouter from "./src/routers/root.router";

// Create a server
const app = expess();
// Middlewares
app.use(expess.json());

// Routers
app.use('/', rootRouter);


// Start server
app.listen(PORT, () => {
    console.log("Server is running on port :", PORT);
});
