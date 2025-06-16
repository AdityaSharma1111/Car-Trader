// console.log("🟢 Starting server...");
import { app } from './app.js'; // or wherever your app is defined
import dotenv from "dotenv";
dotenv.config({
    path: './.env' // specify the location of .env file
})

import connectDB from "./db/index.js";
// import { app } from './app.js';

// console.log("✅ Server.js starting...");


// returning a promise
connectDB()
.then(() => {
    app.listen(process.env.PORT || 5174, () => {
        console.log(`Server is running at port: ${process.env.PORT || 5174}`);
    })
})
.catch((error) => {
    console.log("MongoDB connection failed. Error: ", error);
    
})