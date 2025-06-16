import jwt from "jsonwebtoken";
import mongoose, {Schema} from "mongoose";
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCurrentUser = async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
}

const getMyCars = async (req, res) => {
  const userId = req.user._id;
  // console.log("User ID:", userId);

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid User ID");
  }
  try {
    const user = await User.findById(userId).populate('myCars');
    // console.log("User from DB:", user);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    // console.log("User's cars:", user.myCars);
    return res.status(200).json(
      new ApiResponse(200, user.myCars, "User's cars fetched successfully")
    );
  } catch (error) {
    throw new ApiError(500, "Error fetching user's cars: " + error.message);
  }
};


const addBooking = async (req, res) => {
  try {
    const carId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json(new ApiResponse(400, null, "Invalid Car ID"));
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
    }

    const user = await User.findById(req.user._id);
    const car = await mongoose.model('Car').findById(carId);

    if (!car) {
      return res.status(404).json(new ApiResponse(404, null, "Car not found"));
    }
    // console.log("ID of the car: ", carId);

    if (car.postedBy?.toString() === req.user._id.toString()) {
      return res.status(400).json(new ApiResponse(400, null, "You cannot book your own car listing."));
    }

    if (user.bookedCars.map(bc => bc.toString()).includes(carId.toString())) {
      return res.status(400).json(new ApiResponse(400, null, "Car already booked"));
    }

    user.bookedCars.push(carId);

    const saveOps = [user.save()];

    if (car.postedBy) {
      const owner = await User.findById(car.postedBy);
      if (owner) {
        owner.receivedBookings.push({
          car: car._id,
          bookedBy: req.user._id,
        });
        saveOps.push(owner.save());
      }
    }

    await Promise.all(saveOps);

    return res.status(200).json(
      new ApiResponse(200, user.bookedCars, "Booking added successfully")
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, "Error adding booking: " + error.message)
    );
  }
};


const removeBooking = async (req, res) => {
  try {
    const carId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new ApiError(400, "Invalid Car ID");
    }

    const user = await User.findById(req.user._id);
    const car = await mongoose.model("Car").findById(carId);

    if (!car) {
      throw new ApiError(404, "Car not found");
    }

    // Remove from the booker's bookedCars
    user.bookedCars = user.bookedCars.filter(
      (bookedId) => bookedId.toString() !== carId.toString()
    );
    await user.save();

    // Remove from the owner's receivedBookings
    const carOwner = await User.findById(car.postedBy);
    if(carOwner?.receivedBookings) {
      carOwner.receivedBookings = carOwner.receivedBookings.filter(
        (booking) =>
          booking.car.toString() !== carId.toString() ||
          booking.bookedBy.toString() !== req.user._id.toString()
      );
      await carOwner.save();
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Booking removed successfully"));
  } catch (err) {
    throw new ApiError(500, "Error removing booking: " + err.message);
  }
};


const getBookings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookedCars');
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
      new ApiResponse(200, user.bookedCars, "Booked cars fetched successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Error fetching bookings: " + err.message);
  }
}


const getReceivedBookings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'receivedBookings.car',
        match: { postedBy: req.user._id }, // Only real cars
      })
      .populate('receivedBookings.bookedBy');

    // Remove entries where car was demo (filtered out by match)
    const validBookings = user.receivedBookings.filter(rb => rb.car != null);

    return res.status(200).json(
      new ApiResponse(200, validBookings, "Received bookings fetched successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Error fetching received bookings: " + err.message);
  }
};


const addToFavorites = async (req, res) => {
  try {
    const carId = req.params.id;
    // console.log("ID of the car: ", carId);
    const user = await User.findById(req.user._id);
    
    if (!user.favorites.map(fav => fav.toString()).includes(carId.toString())) {
      user.favorites.push(carId);
      await user.save();
      return res.status(200).json(
        new ApiResponse(200, null, "Car added to favorites")
      );
    } else {
      throw new ApiError(400, "Car already in favorites");
    }

  } catch (err) {
    throw new ApiError(500, "Error adding to favorites: " + err.message);
  }
};


const removeFromFavorites = async (req, res) => {
  try {
    const carId = req.params.id;
    const user = await User.findById(req.user._id);

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== carId.toString()
    );

    await user.save();
    return res.status(200).json(
      new ApiResponse(200, null, "Car removed from favorites")
    );
  } catch (err) {
    throw new ApiError(500, "Error removing from favorites: " + err.message);
  }
};


const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    return res.status(200).json(
      new ApiResponse(200, user.favorites, "Favorite cars fetched successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Error fetching favorites: " + err.message);
  }
};


export {
    getCurrentUser,
    getMyCars,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    addBooking,
    removeBooking,
    getBookings,
    getReceivedBookings
}