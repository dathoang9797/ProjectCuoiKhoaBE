import mongoose, { Types } from 'mongoose';

export interface IPromo {
  _id: Types.ObjectId;
  name: string,
  discount: number,
  expired_date: Date,
}

export const PromoSchema = new mongoose.Schema<IPromo>({
  name: { type: String, required: true },
  discount: { type: Number, required: true },
  expired_date: { type: Date, required: true },
});

export const PromoModel = mongoose.model('Promo', PromoSchema);
