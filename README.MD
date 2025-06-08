Bài tập sequelize

 Viết các API theo các chức năng như sau với database db_food 
đã tạo ở bài tập buổi 5:

- Xử lý like nhà hàng (like, unlike, lấy danh sách like theo nhà hàng và 
user)
- Xử lý đánh giá nhà hàng (thêm đánh giá, lấy danh sách đánh theo 
nhà hàng và user)
- User đặt món (thêm order)

 => Lấy danh sách theo đối tượng thì GET API truyền vào mã id của đối 
tượng đó

* Quản lý người dùng:
    * Lấy danh sách tất cả người dùng.
    * Lấy thông tin chi tiết người dùng theo ID.
* Xử lý Like nhà hàng:**
    * Thêm/xóa lượt like của người dùng cho nhà hàng.
    * Lấy danh sách người dùng đã like một nhà hàng cụ thể.
    * Lấy danh sách nhà hàng mà một người dùng đã like.
* Xử lý Đánh giá nhà hàng:
    * Thêm/cập nhật đánh giá của người dùng cho nhà hàng.
    * Lấy danh sách đánh giá của một người dùng.
    * Lấy danh sách đánh giá của một nhà hàng cụ thể.
* Đặt món:
    * Tạo đơn hàng mới với nhiều món ăn.
    * Lấy danh sách các đơn hàng của một người dùng.

API GET All Users:          http://localhost:9000/users
API GET User by ID:         http://localhost:9000/users/:user_id
--- Restaurant APIs ---
POST Like:                  http://localhost:9000/restaurants/like
POST Unlike:                http://localhost:9000/restaurants/unlike
GET Likes by User:          http://localhost:9000/restaurants/likes/user/:userId
GET Likes by Restaurant:    http://localhost:9000/restaurants/likes/restaurant/:resId
POST Rate:                  http://localhost:9000/restaurants/rate
GET Ratings by User:        http://localhost:9000/restaurants/rates/user/:userId
GET Ratings by Restaurant:  http://localhost:9000/restaurants/rates/restaurant/:resId
--- Order APIs ---
POST Add Order:             http://localhost:9000/orders/add
GET Orders by User:         http://localhost:9000/orders/user/:userId
