import express from 'express';
import { restaurantController } from '@Controllers/RestaurantController';
import { authController } from '@Controllers/AuthController';

const {
  createRestaurant,
  deleteRestaurant,
  getAllRestaurant,
  getRestaurant,
  resizeRestaurantImages,
  updateRestaurant,
  uploadRestaurantImages
} = restaurantController;
const { protect, restrictTo } = authController;

export const restaurantRoute = express.Router();

restaurantRoute.get('/get-all', protect, getAllRestaurant);
restaurantRoute.get('/:_id', protect, getRestaurant);
restaurantRoute.patch('/update/:_id', protect, uploadRestaurantImages, resizeRestaurantImages, updateRestaurant);
restaurantRoute.delete('/delete/:_id', protect, deleteRestaurant);
restaurantRoute.post('/create', protect, createRestaurant);
