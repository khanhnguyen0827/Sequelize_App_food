import express from 'express';//importing express module (import thư viên express)   
import mysql from 'mysql2/promise';   
// This code sets up a simple Express server that listens on port 3000 and responds with "Hello World!" when the root URL is accessed.


const app = express();// creating an instance of express (tạo một phiên bản của express)    

app.use(express.json());//Chuyển dạng json sang đối tượng js trên req.body

const port = 3069;// setting the port to 3000 (thiết lập cổng là 3000)



// Create the connection pool. The pool-specific settings are the defaults (Chúng ta tạo một pool kết nối. Các cài đặt cụ thể của pool là mặc định)
const pool = mysql.createPool(uri ='mysql://root:123456@localhost:3306/qlsv?charset=utf8mb4&timezone=Z');
// Create a route to handle GET requests to the root URL (Tạo một tuyến đường để xử lý các yêu cầu GET đến URL gốc)


// Start the server and listen on the specified port (bắt đầu máy chủ và lắng nghe trên cổng đã chỉ định)   
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


//thư viện cài 
// npm install express thư viện express cốt lõi của nodejs
// npm install nodemon --save-dev thư viện nodemon giúp tự động khởi động lại server khi có thay đổi trong mã nguồn
// npm install mysql2 --save thư viện mysql2 cốt lõi của nodejs
