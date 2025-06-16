import express from 'express';
import {
  createCar,
  getAllCars,
  getCarById,
  getCarsByIds,
  updateCar,
  deleteCar,
  getSimilarCars,
} from '../controllers/car.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {upload} from "../middlewares/multer.middleware.js"
import {asyncHandler} from '../utils/asyncHandler.js'

const router = express.Router();

router.route('/').get(asyncHandler(getAllCars));
router.route('/create').post(verifyJWT, upload.single("carImage"), asyncHandler(createCar));

router.route('/:id')
  .get(getCarById)
  .delete(verifyJWT, asyncHandler(deleteCar));

router.route('/getByIds').post(asyncHandler(getCarsByIds));

router.route('/update/:id')
  .put(verifyJWT, upload.single("carImage"), asyncHandler(updateCar));

router.route('/similar/:id')
  .get(asyncHandler(getSimilarCars));

export default router;