import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog } from '@Utils';
import { IOrderDetail, OrderDetailModel } from '@Models/OrderDetailModel';

const { errorCreateOrder, errorDeleteOrder, errorUpdateOrderById, errorFetchOrder } = MessageLog;

export const orderDetailController = {
  getAllOrderDetail: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const orderDetails = await OrderDetailModel.find();
    if (!orderDetails) return next(new AppErrorHandling(errorFetchOrder, 400));
    return res.status(200).json({ status: 'success', data: orderDetails });
  }),

  getOrderDetail: catchError(async (req: Request<IOrderDetail['_id']>, res: Response, next: NextFunction) => {
    const order = await OrderDetailModel.findById(req.params._id);
    if (!order) return next(new AppErrorHandling(errorFetchOrder, 400));
    return res.status(200).json({ status: 'success', data: order });
  }),

  createOrderDetail: catchError(async (req: Request<{}, {}, IOrderDetail>, res: Response, next: NextFunction) => {
    const { id_coupon, id_menu, id_order, id_user, price, quantity } = req.body;
    const order = new OrderDetailModel({ id_coupon, id_menu, id_order, id_user, price, quantity });
    if (!order) return next(new AppErrorHandling(errorCreateOrder, 400));
    await order.save();
    return res.status(200).json({ status: 'success', data: order });
  }),

  deleteOrderDetail: catchError(async (req: Request<IOrderDetail['_id']>, res: Response, next: NextFunction) => {
    const order = await OrderDetailModel.findByIdAndDelete(req.params._id);
    if (!order) return next(new AppErrorHandling(errorDeleteOrder, 400));
    return res.status(200).json({ status: 'success', data: order });
  }),

  updateOrderDetail: catchError(async (req: Request<IOrderDetail['_id'], {}, IOrderDetail>, res: Response, next: NextFunction) => {
    const order = await OrderDetailModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!order) return next(new AppErrorHandling(errorUpdateOrderById, 400));
    return res.status(200).json({ status: 'success', data: order });
  })
};
