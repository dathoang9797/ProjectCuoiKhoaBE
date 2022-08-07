import mongoose, { Types, Schema } from 'mongoose';

export interface IReview {
  _id: Types.ObjectId;
  review_comment: string;
  rating: number;
  id_res: Types.ObjectId;
  id_user: Types.ObjectId;
}

export const ReviewSchema = new mongoose.Schema<IReview>({
  review_comment: { type: String, required: true },
  rating: { type: Number, required: true },
  id_res: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export const ReviewModel = mongoose.model('Review', ReviewSchema);
