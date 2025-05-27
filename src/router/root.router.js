// 3. Import các định tuyến (Routes)
// Các file trong thư mục 'routes' định nghĩa các endpoint API và ánh xạ chúng tới các controller tương ứng.
// Đây là lớp giao tiếp giữa "View" (server.js) và "Controller".
import express from 'express';
import likeRoutes from './routes/likeRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import orderRoutes from './routes/orderRoutes.js';



// 4. Khởi tạo ứng dụng Express
const rootRouter = express.Router();

// Lấy cổng từ biến môi trường hoặc sử dụng cổng mặc định 8080
// 6. Gắn các định tuyến vào ứng dụng
// Khi có yêu cầu đến các đường dẫn bắt đầu bằng '/api/likes', '/api/reviews', '/api/orders',
// Express sẽ chuyển hướng yêu cầu đó đến các router tương ứng để xử lý.
// Đây là cách mà "View" (server.js) chuyển giao yêu cầu cho "Controller" thông qua "Routes".
rootRouter.use('/api/likes', likeRoutes);
rootRouter.use('/api/reviews', reviewRoutes);
rootRouter.use('/api/orders', orderRoutes);

export default rootRouter;