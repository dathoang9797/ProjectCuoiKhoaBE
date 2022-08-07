import express from 'express';
import { statusController } from '@Controllers/StatusController';
import { authController } from '@Controllers/AuthController';

const { createStatus, deleteStatus, getAllStatus, getStatus, updateStatus } = statusController;
const { protect } = authController;
export const statusRoute = express.Router();

statusRoute.get('/get-all', protect, getAllStatus);
statusRoute.get('/:_id', protect, getStatus);
statusRoute.patch('/update/:_id', protect, updateStatus);
statusRoute.delete('/delete/:_id', protect, deleteStatus);
statusRoute.post('/create', protect, createStatus);
