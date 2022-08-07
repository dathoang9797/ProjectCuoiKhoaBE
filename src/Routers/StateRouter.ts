import express from 'express';
import { stateController } from '@Controllers/StateController';
import { authController } from '@Controllers/AuthController';

const { createState, deleteState, getAllState, getState, updateState } = stateController;
const { protect, restrictTo } = authController;
export const stateRoute = express.Router();

stateRoute.get('/get-all', protect, getAllState);
stateRoute.get('/:_id', protect, getState);
stateRoute.patch('/update/:_id', protect, restrictTo('Admin'), updateState);
stateRoute.delete('/delete/:_id', protect, deleteState);
stateRoute.post('/create', protect, createState);
