import expess from "express";
import { PORT } from "./src/common/constant/app.constant";
import rootRouter from "./src/routers/root.router";
import { handleErr } from "./src/common/helpers/handle-err.helper";

// Create a server
const app = expess();
// Middlewares
app.use(expess.json());

// Routers
app.use('/', rootRouter);

// Middleware bắt lỗi
app.use(    handleErr)


// Start server
app.listen(PORT, () => {
    console.log("Server is running on port :", PORT);
});
