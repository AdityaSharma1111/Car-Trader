import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => { // can use _ if res is not used
    try {
        // req has access of cookies because of middlewaere cookieparser() in app.use()
        // user might not have given accessToken in the cookie but giving it as a custom header "Authorization" sent
        // using Postman's headers
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
        // It returns the decoded payload of the JWT if the signature is valid and the token is not expired.    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user; // adding a new field to the req
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
     
})