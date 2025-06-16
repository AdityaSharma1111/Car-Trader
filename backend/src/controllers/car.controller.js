import axios from 'axios';
import { Car } from '../models/car.model.js';
import { User } from '../models/user.model.js';
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import mongoose from 'mongoose';

// Controllers:-
// Create a new car listing
// Get all car listings
// Get a car listing by ID
// Update a car listing by ID
// Delete a car listing by ID
// Add a car to favorites
// Remove a car from favorites
// Get all favorite cars for a user
// Get similar cars based on criteria

export const createCar = async (req, res) => {
  const {
    name,
    year,
    sellingPrice,
    kmsDriven,
    fuel,
    sellerType,
    transmission,
    owner,
    description,
    location
  } = req.body;

  if ([name, year, sellingPrice, kmsDriven, fuel, sellerType, transmission, owner, location].some((field) => field?.toString().trim() === "")) {
    throw new ApiError(400, "All fields are required.");
  }

  let imageURL = "";
  if (req.file) {
    const temp = req.file.path;
    imageURL = await uploadOnCloudinary(temp);
  }

  const newCar = await Car.create({
    name,
    year,
    sellingPrice,
    kmsDriven,
    fuel,
    sellerType,
    transmission,
    owner,
    carImage: imageURL || "",
    description: description || "",
    location,
    postedBy: req.user._id
  });

  let similarCars = [];

  try {
    // Call Python Flask API to get similar car IDs
    const { data } = await axios.post("http://127.0.0.1:5000/getSimilarCars", {
      name: name.toLowerCase().trim(),
      year,
      sellingPrice,
      kmsDriven,
      fuel,
      sellerType,
      transmission,
      owner
    });

    // Extract the returned similar car IDs (ensure they're valid ObjectId strings)
    similarCars = data?.similarCars?.map((car) => car._id) || [];

    // Update the newly created car with similar cars
    newCar.similarCars = similarCars;
  } catch (err) {
    console.error("Error fetching similar cars from ML API:", err.message);
  } finally {
    await newCar.save();
    await User.findByIdAndUpdate(
      req.user._id,
        { $push: { myCars: newCar._id } }
    );
  }

  // Populate postedBy details and return
  const createdCar = await Car.findById(newCar._id).populate('postedBy', 'fullName email');
  const updatedUser = await User.findById(req.user._id);
  return res.status(201).json(
    new ApiResponse(200, {
      car: createdCar,
      user: updatedUser
    }, "Car listing created successfully")
  );
};


export const getAllCars = async (req, res) => {
  try {
    const { page = 1, search = ""} = req.query;
    const limit = 20;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Search filter on name, fuel, transmission etc.
    // Creating a MongoDB query object that will search across multiple fields using regular expression (regex) matching.
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { fuel: { $regex: search, $options: "i" } },
        { transmission: { $regex: search, $options: "i" } },
        { sellerType: { $regex: search, $options: "i" } },
      ]
    };

    //  Running two MongoDB operations at the same time using Promise.all() for better performance
    const [totalCars, cars] = await Promise.all([
      Car.countDocuments(query),
      Car.find(query)
        .sort({ createdAt: -1 }) // Sort by creation date, most recent first
        .skip(skip)
        .limit(limit)
        .populate("postedBy", "fullName email")
    ]);

    return res.status(200).json(
      new ApiResponse(200, {
        totalCars,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCars / limit),
        cars
      }, "Cars fetched successfully")
    );

  } catch (err) {
    throw new ApiError(500, "Error fetching cars: " + err.message);
  }
};


export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate('postedBy', 'fullName email');
    if (!car) {
      throw new ApiError(404, "Car not found");
    }
    return res.status(200).json(
      new ApiResponse(200, car, "Car details fetched successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Error fetching car: " + err.message);
  }
};

export const getCarsByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No car IDs provided.' });
    }

    const cars = await Car.find({ _id: { $in: ids } });
    res.status(200).json({ cars });
  } catch (error) {
    console.error('Error fetching cars by IDs:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


export const updateCar = async (req, res) => {
  try {
    const carId = req.params.id;
    const updates = req.body;

    const car = await Car.findById(carId);
    if (!car) throw new ApiError(404, "Car not found");

    if (car.postedBy.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to update this car");
    }

    // Handle image if uploaded
    if (req.file) {
      const localPath = req.file.path;
      const uploadedImageUrl = await uploadOnCloudinary(localPath);
      if (uploadedImageUrl) {
        updates.carImage = uploadedImageUrl;
      }
    }

    const updatedCar = await Car.findByIdAndUpdate(carId, updates, { new: true });
    // findByIdAndUpdate updates the document and returns the updated document
    
    return res.status(200).json(
      new ApiResponse(200, updatedCar, "Car updated successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Error updating car: " + err.message);
  }
};


export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) throw new ApiError(404, "Car not found");

    // Authorization check
    if (car.postedBy.toString() !== req.user._id.toString()) {
      throw new ApiError(403, "Not authorized to delete this car");
    }

    const carId = car._id;

    // Remove from all users' favorites
    //To remove a specific carId from the favorites array of all users who have it.
    await User.updateMany(
      { favorites: carId },
      { $pull: { favorites: carId } }
    );

    // Remove from all users' bookedCars
    await User.updateMany(
      { bookedCars: carId },
      { $pull: { bookedCars: carId } }
    );

    // Remove from all users' receivedBookings
    await User.updateMany(
      { "receivedBookings.car": carId },
      { $pull: { receivedBookings: { car: carId } } }
    );
    
    // Finally, delete the car
    await car.deleteOne();

    // deleting the car from user.myCar also
    await User.updateMany(
      { myCars: car._id },
      { $pull: { myCars: car._id } }
    );
    
    return res.status(200).json(
      new ApiResponse(200, null, "Car deleted successfully and references cleaned up")
    );
  } catch (err) {
    console.error("Error deleting car:", err);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error deleting car: " + err.message));
  }
};


export const getSimilarCars = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid car ID");
    }

    // Find the car and populate similarCars
    const car = await Car.findById(id).populate('similarCars');

    if (!car) {
      throw new ApiError(404, "Car not found");
    }

    return res.status(200).json(
      new ApiResponse(200, car.similarCars, "Similar cars fetched successfully")
    );

  } catch (err) {
    console.error("Error fetching similar cars:", err);
    throw new ApiError(500, "Error fetching similar cars: " + err.message);
  }
};