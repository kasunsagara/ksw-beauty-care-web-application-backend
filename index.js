import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import contactRouter from "./routes/contactRouter.js";  

dotenv.config();

const app = express(); 

app.use(cors());

app.use(bodyParser.json());

const mongoUrl = process.env.MONGO_DB_URI; 

mongoose.connect(mongoUrl,{});

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("Database connected");
});

app.use(
    
    (req, res, next) => {

        const token = req.header("Authorization")?.replace("Bearer ", "");
        console.log(token);

        if(token != null) {
            jwt.verify(token, process.env.SECRET, (error, decoded) => {

                if(!error) {
                    req.user = decoded;
                }
            });
        }
        next();
    }
);
                
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/contacts", contactRouter);

app.listen(
    5000,
     () => {
        console.log("Server is running on port 5000");
    }
);