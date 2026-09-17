import express from "express";
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from 'cookie-parser';
dotenv.config();

const app = express();
app.use(cors({credentials:true, origin: process.env.FRONTEND_URL || 'http://localhost:5173'}));

app.use(express.json()); //used when sending json data in raw in post and put methods in postman 
app.use(cookieParser());



app.get('/',(req,res)=>{
    res.send("Starting...")
})





// IMPORT USER ROUTES
import userRoutes from './Routes/userRoutes.js'
app.use('/api/user', userRoutes)



// IMPORT AUTHENTICATION ROUTES
import authRouter from './Routes/authRoutes.js'
app.use('/api/auth',authRouter)



// IMPORT LISTING ROUTES
import listingRouter from './Routes/listingRoutes.js'
app.use('/api/listing', listingRouter)




const port=process.env.PORT || 8000;

if (!process.env.VERCEL) {
  app.listen(port,()=>{console.log("Server Started")})
}

export default app;
