import express from 'express';
import { menuDetailController } from '@Controllers/MenuDetailController';
import { authController } from '@Controllers/AuthController';

const { createMenuDetail, deleteMenuDetail, getAllMenuDetail, getMenuDetail, updateMenuDetail } = menuDetailController;
const { protect } = authController;
export const menuDetailRoute = express.Router();

menuDetailRoute.get('/get-all', protect, getAllMenuDetail);
menuDetailRoute.get('/:_id', protect, getMenuDetail);
menuDetailRoute.patch('/update/:_id', protect, updateMenuDetail);
menuDetailRoute.delete('/delete/:_id', protect, deleteMenuDetail);
menuDetailRoute.post('/create', protect, createMenuDetail);
