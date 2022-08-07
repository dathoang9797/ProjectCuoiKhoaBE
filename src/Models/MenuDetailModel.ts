import mongoose, { Types } from 'mongoose';

export interface IMenuDetail {
  _id: Types.ObjectId;
  id_menu: Types.ObjectId;
  id_sub_menu: Types.ObjectId;
}

export const MenuDetailSchema = new mongoose.Schema<IMenuDetail>({
  id_menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
  id_sub_menu: { type: mongoose.Schema.Types.ObjectId, ref: 'SubMenu' }
});

export const MenuDetailModel = mongoose.model('MenuDetail', MenuDetailSchema);
