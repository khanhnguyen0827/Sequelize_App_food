-- Tạo database
CREATE DATABASE IF NOT EXISTS db_food;

-- Sử dụng database vừa tạo
USE db_food;

-- Tạo bảng users
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Tạo bảng restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    res_id INT PRIMARY KEY AUTO_INCREMENT,
    res_name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    description VARCHAR(255)
);

-- Tạo bảng likes
CREATE TABLE IF NOT EXISTS likes (
    user_id INT,
    res_id INT,
    date_like DATETIME NOT NULL,
    PRIMARY KEY (user_id, res_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (res_id) REFERENCES restaurants(res_id)
);

-- Tạo bảng ratings
CREATE TABLE IF NOT EXISTS ratings (
    user_id INT,
    res_id INT,
    amount INT NOT NULL, -- Điểm đánh giá (ví dụ: 1-5)
    date_rate DATETIME NOT NULL,
    PRIMARY KEY (user_id, res_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (res_id) REFERENCES restaurants(res_id)
);

-- Tạo bảng food_types
CREATE TABLE IF NOT EXISTS food_types (
    type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(255) UNIQUE NOT NULL
);

-- Tạo bảng foods
CREATE TABLE IF NOT EXISTS foods (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    food_name VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    price FLOAT NOT NULL,
    description VARCHAR(255),
    type_id INT,
    res_id INT,
    FOREIGN KEY (type_id) REFERENCES food_types(type_id),
    FOREIGN KEY (res_id) REFERENCES restaurants(res_id)
);

-- Tạo bảng orders
CREATE TABLE IF NOT EXISTS orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    order_date DATETIME NOT NULL,
    total_amount FLOAT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Tạo bảng order_details
CREATE TABLE IF NOT EXISTS order_details (
    order_id INT,
    food_id INT,
    quantity INT NOT NULL,
    price FLOAT NOT NULL, -- Giá của món ăn tại thời điểm đặt hàng
    PRIMARY KEY (order_id, food_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (food_id) REFERENCES foods(food_id)
);


USE db_food; -- Đảm bảo rằng bạn đang sử dụng database db_food

-- Thêm dữ liệu vào bảng users
INSERT INTO users (full_name, email, password) VALUES
('Nguyễn Văn A', 'nguyenvana@example.com', 'password123'),
('Trần Thị B', 'tranhtb@example.com', 'securepass456'),
('Lê Văn C', 'levanc@example.com', 'mysecret789');

-- Thêm dữ liệu vào bảng restaurants
INSERT INTO restaurants (res_name, image, description) VALUES
('Nhà hàng Cơm Tấm Sài Gòn', 'comtam.jpg', 'Chuyên các món cơm tấm truyền thống.'),
('Quán Phở Hàng Nón', 'pho.jpg', 'Phở bò gia truyền nổi tiếng Hà Nội.'),
('Pizza 4P''s', 'pizza4ps.jpg', 'Pizza thủ công kiểu Nhật.');

-- Thêm dữ liệu vào bảng food_types
INSERT INTO food_types (type_name) VALUES
('Món chính'),
('Món khai vị'),
('Đồ uống'),
('Tráng miệng');

-- Thêm dữ liệu vào bảng foods
-- Cơm Tấm Sài Gòn (res_id = 1)
INSERT INTO foods (food_name, image, price, description, type_id, res_id) VALUES
('Cơm Tấm Sườn Bì Chả', 'comtamsbc.jpg', 45000, 'Cơm tấm đặc biệt với sườn, bì, chả.', 1, 1),
('Canh Khổ Qua Nhồi Thịt', 'canhkhoqua.jpg', 20000, 'Canh khổ qua nhồi thịt hầm mềm.', 1, 1),
('Nước Cam Vắt', 'nuoccam.jpg', 25000, 'Nước cam tươi vắt nguyên chất.', 3, 1);

-- Quán Phở Hàng Nón (res_id = 2)
INSERT INTO foods (food_name, image, price, description, type_id, res_id) VALUES
('Phở Bò Tái Nạm', 'photainam.jpg', 50000, 'Phở bò truyền thống với thịt tái và nạm.', 1, 2),
('Quẩy Chiên', 'quay.jpg', 10000, 'Quẩy giòn ăn kèm phở.', 2, 2),
('Trà Đá', 'trada.jpg', 5000, 'Trà đá giải khát.', 3, 2);

-- Pizza 4P's (res_id = 3)
INSERT INTO foods (food_name, image, price, description, type_id, res_id) VALUES
('Margherita Pizza', 'margherita.jpg', 200000, 'Pizza truyền thống với phô mai mozzarella và sốt cà chua.', 1, 3),
('Burrata Prosciutto', 'burrata.jpg', 150000, 'Phô mai Burrata kèm thịt prosciutto.', 2, 3),
('Tiramisu', 'tiramisu.jpg', 80000, 'Bánh tiramisu Ý.', 4, 3);


-- Thêm dữ liệu vào bảng likes (Nguyễn Văn A like Nhà hàng Cơm Tấm và Pizza 4P's, Trần Thị B like Quán Phở)
INSERT INTO likes (user_id, res_id, date_like) VALUES
((SELECT user_id FROM users WHERE email = 'nguyenvana@example.com'), (SELECT res_id FROM restaurants WHERE res_name = 'Nhà hàng Cơm Tấm Sài Gòn'), '2025-06-01 10:00:00'),
((SELECT user_id FROM users WHERE email = 'nguyenvana@example.com'), (SELECT res_id FROM restaurants WHERE res_name = 'Pizza 4P''s'), '2025-06-02 14:30:00'),
((SELECT user_id FROM users WHERE email = 'tranhtb@example.com'), (SELECT res_id FROM restaurants WHERE res_name = 'Quán Phở Hàng Nón'), '2025-06-03 09:15:00');

-- Thêm dữ liệu vào bảng ratings (Nguyễn Văn A đánh giá Cơm Tấm 5 sao, Trần Thị B đánh giá Phở 4 sao)
INSERT INTO ratings (user_id, res_id, amount, date_rate) VALUES
((SELECT user_id FROM users WHERE email = 'nguyenvana@example.com'), (SELECT res_id FROM restaurants WHERE res_name = 'Nhà hàng Cơm Tấm Sài Gòn'), 5, '2025-06-01 11:00:00'),
((SELECT user_id FROM users WHERE email = 'tranhtb@example.com'), (SELECT res_id FROM restaurants WHERE res_name = 'Quán Phở Hàng Nón'), 4, '2025-06-03 10:00:00'),
((SELECT user_id FROM users WHERE email = 'levanc@example.com'), (SELECT res_id FROM restaurants WHERE res_name = 'Nhà hàng Cơm Tấm Sài Gòn'), 3, '2025-06-04 18:00:00');

-- Thêm dữ liệu vào bảng orders (Nguyễn Văn A đặt món cơm tấm, Trần Thị B đặt phở)
INSERT INTO orders (user_id, order_date, total_amount) VALUES
((SELECT user_id FROM users WHERE email = 'nguyenvana@example.com'), '2025-06-05 12:00:00', 65000), -- Cơm Tấm Sườn Bì Chả (45k) + Nước Cam Vắt (25k) = 70k, giả sử có giảm giá
((SELECT user_id FROM users WHERE email = 'tranhtb@example.com'), '2025-06-06 13:30:00', 60000); -- Phở Bò Tái Nạm (50k) + Quẩy Chiên (10k) = 60k

-- Thêm dữ liệu vào bảng order_details
-- Chi tiết đơn hàng của Nguyễn Văn A (order_id = 1)
INSERT INTO order_details (order_id, food_id, quantity, price) VALUES
((SELECT order_id FROM orders WHERE user_id = (SELECT user_id FROM users WHERE email = 'nguyenvana@example.com') AND order_date = '2025-06-05 12:00:00'), (SELECT food_id FROM foods WHERE food_name = 'Cơm Tấm Sườn Bì Chả' AND res_id = (SELECT res_id FROM restaurants WHERE res_name = 'Nhà hàng Cơm Tấm Sài Gòn')), 1, 45000),
((SELECT order_id FROM orders WHERE user_id = (SELECT user_id FROM users WHERE email = 'nguyenvana@example.com') AND order_date = '2025-06-05 12:00:00'), (SELECT food_id FROM foods WHERE food_name = 'Nước Cam Vắt' AND res_id = (SELECT res_id FROM restaurants WHERE res_name = 'Nhà hàng Cơm Tấm Sài Gòn')), 1, 25000);

-- Chi tiết đơn hàng của Trần Thị B (order_id = 2)
INSERT INTO order_details (order_id, food_id, quantity, price) VALUES
((SELECT order_id FROM orders WHERE user_id = (SELECT user_id FROM users WHERE email = 'tranhtb@example.com') AND order_date = '2025-06-06 13:30:00'), (SELECT food_id FROM foods WHERE food_name = 'Phở Bò Tái Nạm' AND res_id = (SELECT res_id FROM restaurants WHERE res_name = 'Quán Phở Hàng Nón')), 1, 50000),
((SELECT order_id FROM orders WHERE user_id = (SELECT user_id FROM users WHERE email = 'tranhtb@example.com') AND order_date = '2025-06-06 13:30:00'), (SELECT food_id FROM foods WHERE food_name = 'Quẩy Chiên' AND res_id = (SELECT res_id FROM restaurants WHERE res_name = 'Quán Phở Hàng Nón')), 1, 10000);