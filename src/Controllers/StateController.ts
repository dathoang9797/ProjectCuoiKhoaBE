import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog } from '@Utils';
import { IState, StateModel } from '@Models/StateModel';

const { errorCreateState, errorDeleteState, errorUpdateStateById, errorFetchState } = MessageLog;

export const stateController = {
  getAllState: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const states = await StateModel.find();
    if (!states) return next(new AppErrorHandling(errorFetchState, 400));
    return res.status(200).json({ status: 'success', data: states });
  }),

  getState: catchError(async (req: Request<IState['_id']>, res: Response, next: NextFunction) => {
    const state = await StateModel.findById(req.params._id);
    if (!state) return next(new AppErrorHandling(errorFetchState, 400));
    return res.status(200).json({ status: 'success', data: state });
  }),

  createState: catchError(async (req: Request<{}, {}, IState>, res: Response, next: NextFunction) => {
    const { state_name } = req.body;
    const state = new StateModel({ state_name });
    if (!state) return next(new AppErrorHandling(errorCreateState, 400));
    await state.save();
    return res.status(200).json({ status: 'success', data: state });
  }),

  deleteState: catchError(async (req: Request<IState['_id']>, res: Response, next: NextFunction) => {
    const state = await StateModel.findByIdAndDelete(req.params._id);
    if (!state) return next(new AppErrorHandling(errorDeleteState, 400));
    return res.status(200).json({ status: 'success', data: state });
  }),

  updateState: catchError(async (req: Request<IState['_id'], {}, IState>, res: Response, next: NextFunction) => {
    const state = await StateModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!state) return next(new AppErrorHandling(errorUpdateStateById, 400));
    return res.status(200).json({ status: 'success', data: state });
  })
};
