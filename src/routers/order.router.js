import express from "express";

// User đặt món
router.post('/add', orderController.addOrder);

// Lấy danh sách order theo user ID (ví dụ)
router.get('/user/:userId', orderController.getOrdersByUserId);