import mongoose, { Types } from 'mongoose';

export interface IMenuCoupon {
  _id: Types.ObjectId;
  id_coupon: Types.ObjectId;
  id_menu: Types.ObjectId;
}

export const MenuCouponSchema = new mongoose.Schema<IMenuCoupon>({
  id_coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  id_menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
});

export const MenuCouponModel = mongoose.model('MenuCoupon', MenuCouponSchema);
