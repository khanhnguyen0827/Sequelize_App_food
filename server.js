// server.js
// Đây là file khởi điểm của ứng dụng Node.js, đóng vai trò là "View" trong mô hình MVC.
// Nó chịu trách nhiệm cấu hình server, định tuyến các yêu cầu và khởi động ứng dụng.

// 1. Import các thư viện cần thiết
// 'express': Framework web cho Node.js, giúp xây dựng các API RESTful một cách dễ dàng.
import express from 'express';
import rootRouter from './src/router/root.router.js';
// 'dotenv': Thư viện giúp tải các biến môi trường từ file .env vào process.env,
// bảo mật thông tin nhạy cảm như chuỗi kết nối database.
import { PORT } from './src/conmon/constant/app.constant.js';

// 2. Tải biến môi trường





// 4. Khởi tạo ứng dụng Express
const app = express();
// Lấy cổng từ biến môi trường hoặc sử dụng cổng mặc định 8080
const port = PORT || 8080;

// 5. Cấu hình Middleware
// Middleware 'express.json()' giúp Express có thể đọc và phân tích các yêu cầu
// có body dưới dạng JSON (ví dụ: khi gửi dữ liệu từ client lên server).
app.use(express.json());
app.use(rootRouter); ;

// 7. Khởi động Server
// Lắng nghe các yêu cầu đến trên cổng đã cấu hình.
app.listen(port, () => {
    console.log(`Server đang chạy trên http://localhost:${port}`);
    console.log('Nhấn Ctrl+C để dừng server.');
});

