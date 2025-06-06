CREATE DATABASE db_food;
USE db_food;

-- Bảng người dùng
CREATE TABLE user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Bảng nhà hàng
CREATE TABLE restaurant (
    res_id INT PRIMARY KEY AUTO_INCREMENT,
    res_name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description VARCHAR(255)
);

-- Bảng lưu trữ lượt thích của người dùng đối với nhà hàng (quan hệ nhiều-nhiều)
CREATE TABLE like_res (
    like_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    res_id INT,
    date_like DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (res_id) REFERENCES restaurant(res_id)
);

-- Bảng lưu trữ đánh giá của người dùng đối với nhà hàng
CREATE TABLE rate_res (
    rate_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    res_id INT,
    amount INT, -- Số sao đánh giá
    date_rate DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (res_id) REFERENCES restaurant(res_id)
);

-- Bảng loại món ăn
CREATE TABLE food_type (
    type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(255) NOT NULL
);

-- Bảng món ăn
CREATE TABLE food (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    food_name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    price FLOAT NOT NULL,
    description VARCHAR(255),
    type_id INT,
    FOREIGN KEY (type_id) REFERENCES food_type(type_id)
);

-- Bảng món ăn thuộc về nhà hàng nào (quan hệ nhiều-nhiều)
CREATE TABLE food_restaurant_mapping (
    id INT PRIMARY KEY AUTO_INCREMENT,
    food_id INT,
    res_id INT,
    FOREIGN KEY (food_id) REFERENCES food(food_id),
    FOREIGN KEY (res_id) REFERENCES restaurant(res_id)
);


-- Bảng đặt món (order)
CREATE TABLE `order` (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    food_id INT,
    amount INT, -- Số lượng
    code VARCHAR(255), -- Có thể dùng để tracking hoặc mã giảm giá
    arr_sub_id VARCHAR(255), -- Có thể dùng cho các món phụ đi kèm
    date_order DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (food_id) REFERENCES food(food_id)
);




USE db_food;

-- Thêm dữ liệu cho bảng user
INSERT INTO `user` (full_name, email, password) VALUES
('Nguyen Van A', 'a.nguyen@example.com', 'password123'),
('Tran Thi B', 'b.tran@example.com', 'password456'),
('Le Van C', 'c.le@example.com', 'password789');

-- Thêm dữ liệu cho bảng restaurant
INSERT INTO `restaurant` (res_name, image, description) VALUES
('Phở Hùng', 'pho_hung.jpg', 'Chuyên các món phở truyền thống Việt Nam'),
('Bún Chả Hương Liên', 'bun_cha_huong_lien.jpg', 'Nơi tổng thống Obama từng ghé thăm'),
('Pizza 4P\'s', 'pizza_4ps.jpg', 'Pizza Neapolitan với phô mai tự làm');

-- Thêm dữ liệu cho bảng food_type
INSERT INTO `food_type` (type_name) VALUES
('Món nước'),
('Món khô'),
('Món Âu'),
('Tráng miệng');

-- Thêm dữ liệu cho bảng food
INSERT INTO `food` (food_name, image, price, description, type_id) VALUES
('Phở Bò Tái', 'pho_bo_tai.jpg', 65000, 'Phở bò với thịt bò thái mỏng', 1),
('Bún Chả Hà Nội', 'bun_cha.jpg', 55000, 'Bún với chả nướng và nước mắm chua ngọt', 2),
('Pizza Margherita', 'pizza_margherita.jpg', 180000, 'Pizza với sốt cà chua, phô mai mozzarella và húng quế', 3),
('Panna Cotta', 'panna_cotta.jpg', 45000, 'Món tráng miệng Ý béo ngậy', 4);

-- Thêm dữ liệu liên kết giữa món ăn và nhà hàng
-- Phở Hùng bán Phở Bò Tái
INSERT INTO `food_restaurant_mapping` (food_id, res_id) VALUES (1, 1);
-- Bún Chả Hương Liên bán Bún Chả Hà Nội
INSERT INTO `food_restaurant_mapping` (food_id, res_id) VALUES (2, 2);
-- Pizza 4P's bán Pizza Margherita và Panna Cotta
INSERT INTO `food_restaurant_mapping` (food_id, res_id) VALUES (3, 3);
INSERT INTO `food_restaurant_mapping` (food_id, res_id) VALUES (4, 3);
-- Giả sử Phở Hùng cũng bán Bún Chả Hà Nội
INSERT INTO `food_restaurant_mapping` (food_id, res_id) VALUES (2, 1);

-- Thêm một vài lượt like mẫu
INSERT INTO `like_res` (user_id, res_id, date_like) VALUES
(1, 1, NOW()), -- User 1 likes Phở Hùng
(1, 3, NOW()), -- User 1 likes Pizza 4P's
(2, 2, NOW()); -- User 2 likes Bún Chả Hương Liên

-- Thêm một vài đánh giá mẫu
INSERT INTO `rate_res` (user_id, res_id, amount, date_rate) VALUES
(1, 1, 5, NOW()), -- User 1 đánh giá Phở Hùng 5 sao
(2, 1, 4, NOW()), -- User 2 đánh giá Phở Hùng 4 sao
(3, 3, 5, NOW()); -- User 3 đánh giá Pizza 4P's 5 sao

-- Thêm một vài đơn đặt hàng mẫu
INSERT INTO `order` (user_id, food_id, amount, date_order) VALUES
(1, 1, 2, NOW()), -- User 1 đặt 2 phần Phở Bò Tái
(2, 3, 1, NOW()); -- User 2 đặt 1 phần Pizza Margherita

