import express from 'express';
import { menuController } from '@Controllers/MenuController';
import { authController } from '@Controllers/AuthController';

const { createMenu, deleteMenu, getAllMenu, getMenu, updateMenu, uploadMenuImages, resizeMenuImages } = menuController;
const { protect, restrictTo } = authController;
export const menuRoute = express.Router();

menuRoute.get('/get-all', protect, getAllMenu);
menuRoute.get('/:_id', protect, getMenu);
menuRoute.patch('/update/:_id', protect, uploadMenuImages, resizeMenuImages, updateMenu);
menuRoute.delete('/delete/:_id', protect, deleteMenu);
menuRoute.post('/create', protect, createMenu);
