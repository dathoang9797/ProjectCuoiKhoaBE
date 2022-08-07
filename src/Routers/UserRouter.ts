import express from 'express';
import { userController } from '@Controllers/UserController';
import { authController } from '@Controllers/AuthController';

export const userRoute = express.Router();

const { createUser, deleteUser, deleteUserProfile, getAllUser, getUser, resizeUserPhoto, updateProfile, updateUser, uploadUserAvatar } =
  userController;

const { protect, restrictTo } = authController;

userRoute.get('/', protect, getUser);
userRoute.get('/get-all', protect, restrictTo('Admin'), getAllUser);
userRoute.post('/create', protect, restrictTo('Admin'), createUser);
userRoute.patch('/update-profile', protect, uploadUserAvatar, updateProfile);
userRoute.patch('/update/:_id', protect, restrictTo('Admin'), uploadUserAvatar, resizeUserPhoto, updateUser);
userRoute.delete('/delete/:_id', protect, restrictTo('Admin'), deleteUser);
userRoute.delete('/delete-profile', protect, deleteUserProfile);
