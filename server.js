import express from 'express';//importing express module (import thư viên express)      
// This code sets up a simple Express server that listens on port 3000 and responds with "Hello World!" when the root URL is accessed.

const app = express();// creating an instance of express (tạo một phiên bản của express)    

app.use(express.json());//Chuyển dạng json sang đối tượng js trên req.body

const port = 3069;// setting the port to 3000 (thiết lập cổng là 3000)




// Start the server and listen on the specified port (bắt đầu máy chủ và lắng nghe trên cổng đã chỉ định)   
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
