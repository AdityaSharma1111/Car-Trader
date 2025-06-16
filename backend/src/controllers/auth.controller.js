import jwt from "jsonwebtoken";
import mongoose, {Schema} from "mongoose";
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        // saving refresh token in the db
        user.refreshToken = refreshToken 
        await user.save({ validateBeforeSave: false }) // by-default, when using this method other fields also kick in like password
        // which is mandatory but we are not passing therefore avoid validating before save

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const register = async (req, res) => {
    const { email, password, fullName, phoneNo } = req.body;
    // console.log("Email:", email);
    if ([fullName, email, password, phoneNo].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required.");
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        throw new ApiError(409, "Email already exists!");
    }

    const existingPhone = await User.findOne({ phoneNo });
    if (existingPhone) {
        throw new ApiError(409, "Phone number already exists!");
    }

    
    const user = await User.create({
        fullName,
        phoneNo,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // ✅ Generate tokens and return just like login
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: createdUser,
                    accessToken,
                    refreshToken
                },
                "User registered Successfully"
            )
        );
}


const login = async (req, res) => {
    const {email, password} = req.body
    
    if(!password || !email){
        throw new ApiError(400, "Email and password is required!!")
    }

    const user = await User.findOne({
        $or: [{email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
    
    // either make another call in the db or update this 'user' object
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    // by-default, anyone can modify the cookies at the frontend
    const options = { // the cookies will only be modified through the server and not by the frontend
        httpOnly: true,
        secure: true
    }
    
    return res
    .status(200)
    .cookie("accessToken", accessToken, options) // key,value
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

}

export {
    register,
    login
}