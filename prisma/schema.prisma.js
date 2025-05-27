// prisma/schema.prisma

// Generator client chỉ định rằng chúng ta sẽ sử dụng Prisma Client cho JavaScript/TypeScript.
generator client {
  provider = "prisma-client-js"
}

// Datasource định nghĩa kết nối đến database.
// Ở đây chúng ta sử dụng MySQL.
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL") // Lấy chuỗi kết nối từ biến môi trường DATABASE_URL
}

// Định nghĩa các bảng (models) tương ứng với cấu trúc database db_food

// Model User: Đại diện cho bảng người dùng
model User {
  user_id     Int      @id @default(autoincrement()) // Khóa chính tự tăng
  full_name   String?  @db.VarChar(255) // Tên đầy đủ
  email       String   @unique @db.VarChar(255) // Email, phải là duy nhất
  password    String   @db.VarChar(255) // Mật khẩu
  phone_number String? @db.VarChar(20) // Số điện thoại
  birth_date  DateTime? @db.Date // Ngày sinh (chỉ lưu ngày)
  avatar      String?  @db.VarChar(255) // URL avatar

  // Mối quan hệ với các bảng khác
  likes       Like[]   // Một người dùng có thể có nhiều lượt thích
  rates       Rate[]   // Một người dùng có thể có nhiều đánh giá
  orders      Order[]  // Một người dùng có thể có nhiều đơn hàng

  @@map("User") // Tên bảng trong database là "User"
}

// Model FoodType: Đại diện cho bảng loại món ăn
model FoodType {
  type_id   Int     @id @default(autoincrement()) // Khóa chính tự tăng
  type_name String? @db.VarChar(255) // Tên loại món ăn

  // Mối quan hệ
  foods     Food[] // Một loại món ăn có thể có nhiều món ăn

  @@map("FoodType") // Tên bảng trong database là "FoodType"
}

// Model Food: Đại diện cho bảng món ăn
model Food {
  food_id     Int      @id @default(autoincrement()) // Khóa chính tự tăng
  food_name   String?  @db.VarChar(255) // Tên món ăn
  image       String?  @db.VarChar(255) // URL hình ảnh
  price       Float? // Giá món ăn
  description String?  @db.VarChar(255) // Mô tả
  type_id     Int? // Khóa ngoại tham chiếu đến FoodType

  // Mối quan hệ
  foodType    FoodType? @relation(fields: [type_id], references: [type_id]) // Mối quan hệ N-1 với FoodType
  subFoods    SubFood[] // Một món ăn có thể có nhiều món phụ
  orders      Order[]   // Một món ăn có thể có trong nhiều đơn hàng

  @@map("Food") // Tên bảng trong database là "Food"
}

// Model SubFood: Đại diện cho bảng món phụ
model SubFood {
  sub_id    Int     @id @default(autoincrement()) // Khóa chính tự tăng
  sub_name  String? @db.VarChar(255) // Tên món phụ
  sub_price Float? // Giá món phụ
  food_id   Int? // Khóa ngoại tham chiếu đến Food

  // Mối quan hệ
  food      Food?   @relation(fields: [food_id], references: [food_id]) // Mối quan hệ N-1 với Food

  @@map("SubFood") // Tên bảng trong database là "SubFood"
}

// Model Restaurant: Đại diện cho bảng nhà hàng
model Restaurant {
  res_id      Int      @id @default(autoincrement()) // Khóa chính tự tăng
  res_name    String?  @db.VarChar(255) // Tên nhà hàng
  image       String?  @db.VarChar(255) // URL hình ảnh
  description String?  @db.VarChar(255) // Mô tả
  address     String?  @db.VarChar(255) // Địa chỉ

  // Mối quan hệ
  likes       Like[] // Một nhà hàng có thể có nhiều lượt thích
  rates       Rate[] // Một nhà hàng có thể có nhiều đánh giá

  @@map("Restaurant") // Tên bảng trong database là "Restaurant"
}

// Model Like: Đại diện cho bảng lượt thích (bảng trung gian cho mối quan hệ N-N giữa User và Restaurant)
model Like {
  user_id   Int // Khóa ngoại tham chiếu đến User
  res_id    Int // Khóa ngoại tham chiếu đến Restaurant
  date_like DateTime @db.Date // Ngày thích (chỉ lưu ngày)

  // Mối quan hệ
  user      User     @relation(fields: [user_id], references: [user_id]) // Mối quan hệ N-1 với User
  restaurant Restaurant @relation(fields: [res_id], references: [res_id]) // Mối quan hệ N-1 với Restaurant

  @@id([user_id, res_id]) // Khóa chính tổng hợp từ user_id và res_id để đảm bảo duy nhất
  @@map("Like") // Tên bảng trong database là "Like"
}

// Model Rate: Đại diện cho bảng đánh giá (bảng trung gian cho mối quan hệ N-N giữa User và Restaurant)
model Rate {
  user_id   Int // Khóa ngoại tham chiếu đến User
  res_id    Int // Khóa ngoại tham chiếu đến Restaurant
  amount    Int // Điểm đánh giá (ví dụ: 1-5 sao)
  date_rate DateTime @db.Date // Ngày đánh giá (chỉ lưu ngày)

  // Mối quan hệ
  user      User     @relation(fields: [user_id], references: [user_id]) // Mối quan hệ N-1 với User
  restaurant Restaurant @relation(fields: [res_id], references: [res_id]) // Mối quan hệ N-1 với Restaurant

  @@id([user_id, res_id]) // Khóa chính tổng hợp từ user_id và res_id để đảm bảo duy nhất
  @@map("Rate") // Tên bảng trong database là "Rate"
}

// Model Order: Đại diện cho bảng đơn hàng
model Order {
  order_id   Int      @id @default(autoincrement()) // Khóa chính tự tăng
  user_id    Int? // Khóa ngoại tham chiếu đến User
  food_id    Int? // Khóa ngoại tham chiếu đến Food
  amount     Int? // Số lượng món ăn
  code       String?  @db.VarChar(50) // Mã đơn hàng
  arr_sub_id String?  @db.VarChar(255) // Lưu trữ ID của các món phụ dưới dạng chuỗi JSON (ví dụ: "[1,2,3]")

  // Mối quan hệ
  user       User?    @relation(fields: [user_id], references: [user_id]) // Mối quan hệ N-1 với User
  food       Food?    @relation(fields: [food_id], references: [food_id]) // Mối quan hệ N-1 với Food

  @@map("Order") // Tên bảng trong database là "Order"
}
