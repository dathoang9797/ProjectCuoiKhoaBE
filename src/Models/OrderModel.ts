import mongoose, { Types } from 'mongoose';

export interface IOrder {
  _id: Types.ObjectId;
  start_date: Date;
  end_date: Date;
  status: boolean;
  id_status: Types.ObjectId;
}

export const OrderSchema = new mongoose.Schema<IOrder>({
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { type: Boolean, default: false },
  id_status: { type: mongoose.Schema.Types.ObjectId, ref: 'Status' }
});

export const OrderModel = mongoose.model('Order', OrderSchema);
