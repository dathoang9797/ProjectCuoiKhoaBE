import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog, isImage } from '@Utils';
import { IMenuCoupon, MenuCouponModel } from '@Models/MenuPromoModel';

const { errorCreateMenuPromo, errorDeleteMenuPromo, errorUpdateMenuPromoById, errorFetchMenuPromo } = MessageLog;

export const menuPromoController = {
  getAllMenuPromo: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const menuPromos = await MenuCouponModel.find();
    if (!menuPromos) return next(new AppErrorHandling(errorFetchMenuPromo, 400));
    return res.status(200).json({ status: 'success', data: menuPromos });
  }),

  getMenuPromo: catchError(async (req: Request<IMenuCoupon['_id']>, res: Response, next: NextFunction) => {
    const menuPromo = await MenuCouponModel.findById(req.params._id);
    if (!menuPromo) return next(new AppErrorHandling(errorFetchMenuPromo, 400));
    return res.status(200).json({ status: 'success', data: menuPromo });
  }),

  createMenuPromo: catchError(async (req: Request<{}, {}, IMenuCoupon>, res: Response, next: NextFunction) => {
    const { id_coupon,id_menu } = req.body;
    const menuPromo = new MenuCouponModel({ id_coupon,id_menu });
    if (!menuPromo) return next(new AppErrorHandling(errorCreateMenuPromo, 400));
    await menuPromo.save();
    return res.status(200).json({ status: 'success', data: menuPromo });
  }),

  deleteMenuPromo: catchError(async (req: Request<IMenuCoupon['_id']>, res: Response, next: NextFunction) => {
    const menuPromo = await MenuCouponModel.findByIdAndDelete(req.params._id);
    if (!menuPromo) return next(new AppErrorHandling(errorDeleteMenuPromo, 400));
    return res.status(200).json({ status: 'success', data: menuPromo });
  }),

  updateMenuPromo: catchError(async (req: Request<IMenuCoupon['_id'], {}, IMenuCoupon>, res: Response, next: NextFunction) => {
    const menuPromo = await MenuCouponModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!menuPromo) return next(new AppErrorHandling(errorUpdateMenuPromoById, 400));
    return res.status(200).json({ status: 'success', data: menuPromo });
  })
};
