import express from 'express';
import { subMenuController } from '@Controllers/SubMenuController';
import { authController } from '@Controllers/AuthController';

const { deleteSubMenu, createSubMenu, getAllSubMenu, getSubMenu, updateSubMenu } = subMenuController;
const { protect } = authController;
export const subMenuRoute = express.Router();

subMenuRoute.get('/get-all', protect, getAllSubMenu);
subMenuRoute.get('/:_id', protect, getSubMenu);
subMenuRoute.patch('/update/:_id', protect, updateSubMenu);
subMenuRoute.delete('/delete/:_id', protect, deleteSubMenu);
subMenuRoute.post('/create', protect, createSubMenu);
