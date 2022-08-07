import express from 'express';
import { reviewController } from '@Controllers/ReviewController';
import { authController } from '@Controllers/AuthController';

const { createReview, deleteReview, getAllReviews, getReview, updateReview } = reviewController;
const { protect } = authController;
export const reviewRoute = express.Router();

reviewRoute.get('/get-all', protect, getAllReviews);
reviewRoute.get('/:_id', protect, getReview);
reviewRoute.patch('/update/:_id', protect, updateReview);
reviewRoute.delete('/delete/:_id', protect, deleteReview);
reviewRoute.post('/create', protect, createReview);
