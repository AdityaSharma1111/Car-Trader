import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"; // a bearer token
import bcrypt from "bcrypt"; // used for encryption and decryption of passwords

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true, 
    },
    fullName: {
        type: String,
        required: true,
        trim: true, 
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true
    },
    myCars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car', default: [] }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car', default: [] }],
    bookedCars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car', default: [] }],
    receivedBookings: [
        {
        car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
        bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now }
        }
    ],
    refreshToken: {
        type: String
    }
}, {timestamps: true});

userSchema.pre("save", async function (next) { // dont use arrow function as they dont have 'this' reference
    if(!this.isModified("password")) return next(); // if the password is not modified/created new

    this.password = await bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){ // adding a new method to check the password
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){ // used for user authentication but shorter expiry duration
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){ // longer expiry duration than access token
    return jwt.sign(
        {
            _id: this._id, // fewer payload(data) than access token
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)