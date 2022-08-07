import mongoose, { Types } from 'mongoose';

export interface ICategory {
  _id: Types.ObjectId;
  category_name: string;
  url_img: string[];
}

export const CategorySchema = new mongoose.Schema<ICategory>({
  category_name: { type: String, required: true },
  url_img: { type: [String], required: true, default: null }
});

export const CategoryModel = mongoose.model('Category', CategorySchema);
