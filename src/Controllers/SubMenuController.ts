import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog } from '@Utils';
import { ISubMenu, SubMenuModel } from '@Models/SubMenuModel';

const { errorFetchSubMenu, errorCreateSubMenu, errorDeleteSubMenu, errorUpdateSubMenuById } = MessageLog;

export const subMenuController = {
  getAllSubMenu: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const subMenus = await SubMenuModel.find();
    if (!subMenus) return next(new AppErrorHandling(errorFetchSubMenu, 400));
    return res.status(200).json({ status: 'success', data: subMenus });
  }),

  getSubMenu: catchError(async (req: Request<ISubMenu['_id']>, res: Response, next: NextFunction) => {
    const subMenu = await SubMenuModel.findById(req.params._id);
    if (!subMenu) return next(new AppErrorHandling(errorFetchSubMenu, 400));
    return res.status(200).json({ status: 'success', data: subMenu });
  }),

  createSubMenu: catchError(async (req: Request<{}, {}, ISubMenu>, res: Response, next: NextFunction) => {
    const { price, sub_menu_name, id_restaurant } = req.body;
    const subMenu = new SubMenuModel({ price, sub_menu_name, id_restaurant });
    if (!subMenu) return next(new AppErrorHandling(errorCreateSubMenu, 400));
    await subMenu.save();
    return res.status(200).json({ status: 'success', data: subMenu });
  }),

  deleteSubMenu: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const subMenu = await SubMenuModel.findByIdAndDelete(req.params._id);
    if (!subMenu) return next(new AppErrorHandling(errorDeleteSubMenu, 400));
    return res.status(200).json({ status: 'success', data: subMenu });
  }),

  updateSubMenu: catchError(async (req: Request<ISubMenu['_id'], {}, ISubMenu>, res: Response, next: NextFunction) => {
    const subMenu = await SubMenuModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!subMenu) return next(new AppErrorHandling(errorUpdateSubMenuById, 400));
    return res.status(200).json({ status: 'success', data: subMenu });
  })
};
