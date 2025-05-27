
// src/common/utils/asyncHandler.js
// Hàm tiện ích để bắt lỗi từ các hàm async/await trong Express
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
export default asyncHandler;