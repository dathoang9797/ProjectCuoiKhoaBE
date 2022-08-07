import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog } from '@Utils';
import { IOrder, OrderModel } from '@Models/OrderModel';

const { errorCreateOrder, errorDeleteOrder, errorUpdateOrderById, errorFetchOrder } = MessageLog;

export const orderController = {
  getAllOrder: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const orders = await OrderModel.find();
    if (!orders) return next(new AppErrorHandling(errorFetchOrder, 400));
    return res.status(200).json({ status: 'success', data: orders });
  }),

  getOrder: catchError(async (req: Request<IOrder['_id']>, res: Response, next: NextFunction) => {
    const order = await OrderModel.findById(req.params._id);
    if (!order) return next(new AppErrorHandling(errorFetchOrder, 400));
    return res.status(200).json({ status: 'success', data: order });
  }),

  createOrder: catchError(async (req: Request<{}, {}, IOrder>, res: Response, next: NextFunction) => {
    const { end_date, id_status, start_date, status } = req.body;
    const order = new OrderModel({ end_date, id_status, start_date, status });
    if (!order) return next(new AppErrorHandling(errorCreateOrder, 400));
    await order.save();
    return res.status(200).json({ status: 'success', data: order });
  }),

  deleteOrder: catchError(async (req: Request<IOrder['_id']>, res: Response, next: NextFunction) => {
    const order = await OrderModel.findByIdAndDelete(req.params._id);
    if (!order) return next(new AppErrorHandling(errorDeleteOrder, 400));
    return res.status(200).json({ status: 'success', data: order });
  }),

  updateOrder: catchError(async (req: Request<IOrder['_id'], {}, IOrder>, res: Response, next: NextFunction) => {
    const order = await OrderModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!order) return next(new AppErrorHandling(errorUpdateOrderById, 400));
    return res.status(200).json({ status: 'success', data: order });
  })
};
