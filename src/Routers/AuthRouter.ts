import express from 'express';
import { authController } from '@Controllers/AuthController';
export const authRoute = express.Router();

const { forgotPassword, protect, resetPassword, restrictTo, signIn, signUp, updatePassword } = authController;

authRoute.post('/signin', signIn);
authRoute.post('/signup', signUp);
authRoute.post('/forgotpassword', forgotPassword);
authRoute.patch('/updatepassword', protect, updatePassword);
authRoute.patch('/resetpassword/:token', protect, resetPassword);
