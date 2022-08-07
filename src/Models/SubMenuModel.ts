import mongoose, { Types } from 'mongoose';

export interface ISubMenu {
  _id: Types.ObjectId;
  sub_menu_name: string;
  price: number;
  id_restaurant: Types.ObjectId;
}

export const SubMenuSchema = new mongoose.Schema<ISubMenu>({
  sub_menu_name: { type: String, required: true },
  price: { type: Number, required: true },
  id_restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }
});

export const SubMenuModel = mongoose.model('SubMenu', SubMenuSchema);
