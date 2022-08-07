import express from 'express';
import { categoryController } from '@Controllers/CategoryController';
import { authController } from '@Controllers/AuthController';

const { createCategory, deleteCategory, getAllCategory, getCategory, updateCategory, resizeCategoryImages, uploadCategoryImages } =
  categoryController;
const { protect } = authController;
export const categoryRoute = express.Router();

categoryRoute.get('/get-all', protect, getAllCategory);
categoryRoute.get('/:_id', protect, getCategory);
categoryRoute.patch('/update/:_id', protect, uploadCategoryImages, resizeCategoryImages, updateCategory);
categoryRoute.delete('/delete/:_id', protect, deleteCategory);
categoryRoute.post('/create', protect, createCategory);
