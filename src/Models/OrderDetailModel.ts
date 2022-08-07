import mongoose, { Types } from 'mongoose';

export interface IOrderDetail {
  _id: Types.ObjectId;
  id_order: Types.ObjectId;
  id_user: Types.ObjectId;
  id_menu: Types.ObjectId;
  id_coupon: Types.ObjectId;
  price: number;
  quantity: number;
}

export const OrderDetailSchema = new mongoose.Schema<IOrderDetail>({
  id_order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  id_menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  id_coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true }
});

export const OrderDetailModel = mongoose.model('OrderDetail', OrderDetailSchema);
