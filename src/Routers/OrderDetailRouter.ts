import express from 'express';
import { orderDetailController } from '@Controllers/OrderDetailController';
import { authController } from '@Controllers/AuthController';

const { createOrderDetail, deleteOrderDetail, getAllOrderDetail, getOrderDetail, updateOrderDetail } = orderDetailController;
const { protect } = authController;
export const orderDetailRoute = express.Router();

orderDetailRoute.get('/get-all', protect, getAllOrderDetail);
orderDetailRoute.get('/:_id', protect, getOrderDetail);
orderDetailRoute.patch('/update/:_id', protect, updateOrderDetail);
orderDetailRoute.delete('/delete/:_id', protect, deleteOrderDetail);
orderDetailRoute.post('/create', protect, createOrderDetail);
