import { Router } from "express";
import {
  getCurrentUser,
  getMyCars,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getBookings,
  addBooking,
  removeBooking,
  getReceivedBookings
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// Current user info
router.route("/current").get(verifyJWT, asyncHandler(getCurrentUser));
router.route("/myCars").get(verifyJWT, asyncHandler(getMyCars));

// Favorites
router.route('/favorites').get(verifyJWT, asyncHandler(getFavorites));
router.route('/favorites/:id')
  .post(verifyJWT, asyncHandler(addToFavorites))
  .delete(verifyJWT, asyncHandler(removeFromFavorites));

// Bookings made by the user
router.route('/bookings').get(verifyJWT, asyncHandler(getBookings));
router.route('/bookings/:id')
  .post(verifyJWT, asyncHandler(addBooking))     // Add booking
  .delete(verifyJWT, asyncHandler(removeBooking)); //Remove booking

// Bookings received by this user (as car owner)
router.route('/received-bookings').get(verifyJWT, asyncHandler(getReceivedBookings));

export default router;