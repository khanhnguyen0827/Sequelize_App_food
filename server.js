import 'dotenv/config'; // Tải biến môi trường từ .env
import express from 'express';
import rootRoutes from './src/routes/root.routes.js'; // Import root.routes.js
import prisma from './src/common/prisma/init.prisma.js'; // Import init.prisma.js

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để phân tích body của request dưới dạng JSON
app.use(express.json());

// Gắn các API routes dưới prefix /api
app.use('/api', rootRoutes);

// Middleware xử lý lỗi tập trung
app.use((err, req, res, next) => {
  console.error('Lỗi API:', err.stack); // Ghi log chi tiết lỗi
  res.status(err.statusCode || 500).json({
    message: err.message || 'Đã có lỗi xảy ra trên server.',
    error: process.env.NODE_ENV === 'development' ? err : {}, // Chỉ hiển thị lỗi chi tiết trong môi trường dev
  });
});

// Khởi động server và kết nối database
async function startServer() {
  try {
    await prisma.$connect();
    console.log('Kết nối thành công tới Database MySQL.');
    app.listen(PORT, () => {
      console.log(`Server đang chạy trên cổng ${PORT}`);
      console.log(`Truy cập API tại: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Không thể kết nối đến Database:', error);
    process.exit(1); // Thoát ứng dụng nếu không thể kết nối database
  }
}

startServer();

// Xử lý khi ứng dụng bị tắt để đóng kết nối database
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('Ngắt kết nối Database.');
});
