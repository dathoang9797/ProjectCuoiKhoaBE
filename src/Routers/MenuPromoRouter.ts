import express from 'express';
import { menuPromoController } from '@Controllers/MenuPromoController';
import { authController } from '@Controllers/AuthController';

const { createMenuPromo, deleteMenuPromo, getAllMenuPromo, getMenuPromo, updateMenuPromo } = menuPromoController;
const { protect } = authController;
export const menuPromoRoute = express.Router();

menuPromoRoute.get('/get-all', protect, getAllMenuPromo);
menuPromoRoute.get('/:_id', protect, getMenuPromo);
menuPromoRoute.patch('/update/:_id', protect, updateMenuPromo);
menuPromoRoute.delete('/delete/:_id', protect, deleteMenuPromo);
menuPromoRoute.post('/create', protect, createMenuPromo);
