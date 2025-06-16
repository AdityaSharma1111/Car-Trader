import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from './routes/auth.routes.js'
import carRouter from './routes/car.routes.js'
import userRouter from './routes/user.routes.js'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true, limit: "16kb" }));

// console.log("✅ App.js loaded");

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cars", carRouter);
app.use("/api/v1/user", userRouter);


// without this the error is coming in html format
app.use((err, req, res, next) => {
    console.error("🚨 Global Error Handler:", err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
        stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    });
});


export { app };