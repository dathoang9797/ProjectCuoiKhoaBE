import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog, isImage } from '@Utils';
import { IMenuDetail, MenuDetailModel } from '@Models/MenuDetailModel';

const { errorCreateMenuDetail, errorDeleteMenuDetail, errorUpdateMenuDetailById, errorFetchMenuDetail } = MessageLog;

export const menuDetailController = {
  getAllMenuDetail: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const menuDetails = await MenuDetailModel.find();
    if (!menuDetails) return next(new AppErrorHandling(errorFetchMenuDetail, 400));
    return res.status(200).json({ status: 'success', data: menuDetails });
  }),

  getMenuDetail: catchError(async (req: Request<IMenuDetail['_id']>, res: Response, next: NextFunction) => {
    const menuDetail = await MenuDetailModel.findById(req.params._id);
    if (!menuDetail) return next(new AppErrorHandling(errorFetchMenuDetail, 400));
    return res.status(200).json({ status: 'success', data: menuDetail });
  }),

  createMenuDetail: catchError(async (req: Request<{}, {}, IMenuDetail>, res: Response, next: NextFunction) => {
    const { id_menu, id_sub_menu } = req.body;
    const menuDetail = new MenuDetailModel({ id_menu, id_sub_menu });
    if (!menuDetail) return next(new AppErrorHandling(errorCreateMenuDetail, 400));
    await menuDetail.save();
    return res.status(200).json({ status: 'success', data: menuDetail });
  }),

  deleteMenuDetail: catchError(async (req: Request<IMenuDetail['_id']>, res: Response, next: NextFunction) => {
    const menuDetail = await MenuDetailModel.findByIdAndDelete(req.params._id);
    if (!menuDetail) return next(new AppErrorHandling(errorDeleteMenuDetail, 400));
    return res.status(200).json({ status: 'success', data: menuDetail });
  }),

  updateMenuDetail: catchError(async (req: Request<IMenuDetail['_id'], {}, IMenuDetail>, res: Response, next: NextFunction) => {
    const menuDetail = await MenuDetailModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!menuDetail) return next(new AppErrorHandling(errorUpdateMenuDetailById, 400));
    return res.status(200).json({ status: 'success', data: menuDetail });
  })
};
