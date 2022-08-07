import express from 'express';
import { promoController } from '@Controllers/PromoController';
import { authController } from '@Controllers/AuthController';

const { createPromo, deletePromo, getAllPromo, getPromo, updatePromo } = promoController;
const { protect, restrictTo } = authController;
export const promoRoute = express.Router();

promoRoute.get('/get-all', protect, getAllPromo);
promoRoute.get('/:_id', protect, getPromo);
promoRoute.patch('/update/:_id', protect, updatePromo);
promoRoute.delete('/delete/:_id', protect, deletePromo);
promoRoute.post('/create', protect, createPromo);
