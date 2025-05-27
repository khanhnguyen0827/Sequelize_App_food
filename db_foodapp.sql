-- Cơ sở dữ liệu: db_food
CREATE DATABASE IF NOT EXISTS db_food;
USE db_food;

-- Bảng: Users (Người dùng)
-- Lưu trữ thông tin người dùng
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Mật khẩu đã mã hóa
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng: Restaurants (Nhà hàng)
-- Lưu trữ thông tin nhà hàng
CREATE TABLE IF NOT EXISTS Restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng: Dishes (Món ăn)
-- Lưu trữ thông tin về các món ăn do nhà hàng cung cấp
CREATE TABLE IF NOT EXISTS Dishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id) ON DELETE CASCADE
);

-- Bảng: Likes (Lượt thích)
-- Lưu trữ lượt thích của người dùng đối với nhà hàng
CREATE TABLE IF NOT EXISTS Likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    -- Một người dùng chỉ có thể thích một nhà hàng một lần
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id) ON DELETE CASCADE,
    UNIQUE (user_id, restaurant_id) -- Đảm bảo một người dùng chỉ có thể thích một nhà hàng một lần
);

-- Bảng: Ratings (Đánh giá)
-- Lưu trữ đánh giá và nhận xét của người dùng đối với nhà hàng
CREATE TABLE IF NOT EXISTS Ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    rating DECIMAL(2, 1) CHECK (rating >= 1 AND rating <= 5) NOT NULL, -- Đánh giá từ 1.0 đến 5.0
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id) ON DELETE CASCADE,
    UNIQUE (user_id, restaurant_id) -- Đảm bảo một người dùng chỉ có thể đánh giá một nhà hàng một lần (có thể cập nhật đánh giá của họ)
);

-- Bảng: Orders (Đơn hàng)
-- Lưu trữ các đơn đặt món của người dùng
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL, -- Để dễ dàng liên kết một đơn hàng với một nhà hàng, mặc dù các món ăn tự thân đã liên kết với nhà hàng
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending', -- Trạng thái đơn hàng
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(id) ON DELETE CASCADE
);

-- Bảng: OrderItems (Chi tiết đơn hàng)
-- Lưu trữ các món ăn riêng lẻ trong một đơn hàng
CREATE TABLE IF NOT EXISTS OrderItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    dish_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_order DECIMAL(10, 2) NOT NULL, -- Giá của món ăn tại thời điểm đặt hàng
    FOREIGN KEY (order_id) REFERENCES Orders(id) ON DELETE CASCADE,
    FOREIGN KEY (dish_id) REFERENCES Dishes(id) ON DELETE CASCADE
);



USE db_food;

-- Thêm dữ liệu vào bảng Users (Người dùng)
INSERT INTO Users (username, email, password) VALUES
('nguyenvana', 'vana@example.com', 'hashed_password_1'),
('phamthib', 'thib@example.com', 'hashed_password_2'),
('leminhc', 'minhc@example.com', 'hashed_password_3');

-- Thêm dữ liệu vào bảng Restaurants (Nhà hàng)
INSERT INTO Restaurants (name, address, phone, description) VALUES
('Nhà hàng Phở Ngon', '123 Đường Nguyễn Huệ, Q1, TP.HCM', '0281234567', 'Chuyên phở bò truyền thống'),
('Quán Cơm Tấm Sài Gòn', '456 Đường Lê Lợi, Q1, TP.HCM', '0287654321', 'Cơm tấm sườn bì chả đặc biệt'),
('Cafe Sữa Đá View Đẹp', '789 Đường Đồng Khởi, Q1, TP.HCM', '0289876543', 'Cafe truyền thống và không gian đẹp'),
('Nhà hàng Hải Sản Tươi', '101 Đường Hoàng Sa, Q3, TP.HCM', '0281122334', 'Hải sản tươi sống, đa dạng món');

-- Thêm dữ liệu vào bảng Dishes (Món ăn)
INSERT INTO Dishes (restaurant_id, name, description, price) VALUES
(1, 'Phở Bò Đặc Biệt', 'Phở bò tái gầu, nước dùng đậm đà', 65000.00),
(1, 'Phở Gà', 'Phở gà xé, nước dùng thanh ngọt', 55000.00),
(2, 'Cơm Tấm Sườn Bì Chả', 'Cơm tấm sườn nướng, bì, chả trứng', 45000.00),
(2, 'Cơm Tấm Gà Nướng', 'Cơm tấm đùi gà nướng mật ong', 50000.00),
(3, 'Cafe Sữa Đá', 'Cafe phin truyền thống với sữa đặc', 30000.00),
(3, 'Trà Đào Cam Sả', 'Thức uống giải khát thơm ngon', 40000.00),
(4, 'Tôm Nướng Muối Ớt', 'Tôm tươi nướng muối ớt cay nồng', 180000.00),
(4, 'Lẩu Thái Hải Sản', 'Lẩu chua cay với các loại hải sản tươi', 250000.00);


-- Thêm dữ liệu vào bảng Likes (Lượt thích)
-- user_id 1 thích nhà hàng 1, 2
-- user_id 2 thích nhà hàng 1, 3
-- user_id 3 thích nhà hàng 2, 4
INSERT INTO Likes (user_id, restaurant_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 3),
(3, 2),
(3, 4);

-- Thêm dữ liệu vào bảng Ratings (Đánh giá)
-- user_id 1 đánh giá nhà hàng 1, 2
-- user_id 2 đánh giá nhà hàng 1, 3
-- user_id 3 đánh giá nhà hàng 2, 4
INSERT INTO Ratings (user_id, restaurant_id, rating, comment) VALUES
(1, 1, 4.5, 'Phở rất ngon, nước dùng đậm đà!'),
(1, 2, 4.0, 'Cơm tấm ổn, giá hợp lý.'),
(2, 1, 5.0, 'Phở tuyệt vời, sẽ quay lại nhiều lần.'),
(2, 3, 3.5, 'Cafe ngon, view đẹp nhưng hơi đông.'),
(3, 2, 4.5, 'Cơm tấm ngon, miếng sườn nướng rất vừa vặn.'),
(3, 4, 4.8, 'Hải sản tươi, lẩu thái rất chuẩn vị.');

-- Thêm dữ liệu vào bảng Orders (Đơn hàng)
-- user_id 1 đặt hàng từ nhà hàng 1 và 2
-- user_id 2 đặt hàng từ nhà hàng 3
INSERT INTO Orders (user_id, restaurant_id, total_amount, status) VALUES
(1, 1, 65000.00, 'completed'), -- Đơn 1: Phở Bò Đặc Biệt
(1, 2, 45000.00, 'pending'),   -- Đơn 2: Cơm Tấm Sườn Bì Chả
(2, 3, 70000.00, 'completed'), -- Đơn 3: Cafe Sữa Đá + Trà Đào Cam Sả
(3, 4, 180000.00, 'pending');  -- Đơn 4: Tôm Nướng Muối Ớt

-- Thêm dữ liệu vào bảng OrderItems (Chi tiết đơn hàng)
INSERT INTO OrderItems (order_id, dish_id, quantity, price_at_order) VALUES
(1, 1, 1, 65000.00), -- Đơn 1: Phở Bò Đặc Biệt
(2, 3, 1, 45000.00), -- Đơn 2: Cơm Tấm Sườn Bì Chả
(3, 5, 1, 30000.00), -- Đơn 3: Cafe Sữa Đá
(3, 6, 1, 40000.00), -- Đơn 3: Trà Đào Cam Sả
(4, 7, 1, 180000.00); -- Đơn 4: Tôm Nướng Muối Ớt 