import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog } from '@Utils';
import { IStatus, StatusModel } from '@Models/StatusModel';

const { errorFetchStatus, errorCreateStatus, errorDeleteStatus, errorUpdateStatusById } = MessageLog;

export const statusController = {
  getAllStatus: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const status = await StatusModel.find();
    if (!status) return next(new AppErrorHandling(errorFetchStatus, 400));
    return res.status(200).json({ status: 'success', data: status });
  }),

  getStatus: catchError(async (req: Request<IStatus['_id']>, res: Response, next: NextFunction) => {
    const status = await StatusModel.findById(req.params._id);
    if (!status) return next(new AppErrorHandling(errorFetchStatus, 400));
    return res.status(200).json({ status: 'success', data: status });
  }),

  createStatus: catchError(async (req: Request<{}, {}, IStatus>, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const status = new StatusModel({ name });
    if (!status) return next(new AppErrorHandling(errorCreateStatus, 400));
    await status.save();
    return res.status(200).json({ status: 'success', data: status });
  }),

  deleteStatus: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const status = await StatusModel.findByIdAndDelete(req.params._id);
    if (!status) return next(new AppErrorHandling(errorDeleteStatus, 400));
    return res.status(200).json({ status: 'success', data: status });
  }),

  updateStatus: catchError(async (req: Request<IStatus['_id'], {}, IStatus>, res: Response, next: NextFunction) => {
    const status = await StatusModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!status) return next(new AppErrorHandling(errorUpdateStatusById, 400));
    return res.status(200).json({ status: 'success', data: status });
  })
};
