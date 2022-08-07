import mongoose, { Types } from 'mongoose';

export interface IMenu {
  _id: Types.ObjectId;
  menu_name: string;
  url_img: string[];
  menu_description: string;
  menu_type: string;
  rating: number;
  price: number;
}

export const MenuSchema = new mongoose.Schema<IMenu>({
  menu_name: { type: String, required: true, unique: true },
  url_img: { type: [String], required: true, default: null },
  menu_description: { type: String, required: true },
  menu_type: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 }
});

export const MenuModel = mongoose.model('Menu', MenuSchema);
