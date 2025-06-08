import { responseError } from "./response.helper.js";

export const handleErr = 
       // Middleware 2
    (err,req, res, next)=>{
        console.log(`Middleware gôm lỗi: ${err}`);
        const resdata = responseError(err?.message, err?.code, err?.stack);
        res.status(resdata.statusCode).json( resdata);
        return; }
    ;