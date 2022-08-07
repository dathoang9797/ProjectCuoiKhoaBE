import express from 'express';
import { orderController } from '@Controllers/OrderController';
import { authController } from '@Controllers/AuthController';

const { createOrder, deleteOrder, getAllOrder, getOrder, updateOrder } = orderController;
const { protect, restrictTo } = authController;
export const orderRoute = express.Router();

orderRoute.get('/get-all', protect, getAllOrder);
orderRoute.get('/:_id', protect, getOrder);
orderRoute.patch('/update/:_id', protect, updateOrder);
orderRoute.delete('/delete/:_id', protect, deleteOrder);
orderRoute.post('/create', protect, createOrder);
