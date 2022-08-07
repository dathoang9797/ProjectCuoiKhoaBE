import express from 'express';
import { cityController } from '@Controllers/CityController';
import { authController } from '@Controllers/AuthController';

const { createCity, deleteCity, getAllCity, getCity, updateCity } = cityController;
const { protect, restrictTo } = authController;
export const cityRoute = express.Router();

cityRoute.get('/get-all', protect, getAllCity);
cityRoute.get('/:_id', protect, getCity);
cityRoute.patch('/update/:_id', updateCity);
cityRoute.delete('/delete/:_id', protect, deleteCity);
cityRoute.post('/create', protect, createCity);
