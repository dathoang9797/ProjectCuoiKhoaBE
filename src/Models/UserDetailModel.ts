import mongoose, { Types } from 'mongoose';

export interface IUserDetail {
  _id: Types.ObjectId;
  id_user: Types.ObjectId;
  city: string;
  state: string
  full_name: string;
  phone: string;
  street: string;
  avatar: string;
}

export const UserDetailSchema = new mongoose.Schema<IUserDetail>({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  full_name: { type: String, required: [true, 'Please provide fullname'] },
  street: { type: String, required: [true, 'Please provide street'] },
  phone: { type: String, required: [true, 'Please provide phone'] },
  city: { type: String, required: [true, 'Please provide city'] },
  state: { type: String, required: [true, 'Please provide state'] },
});

export const UserDetailModel = mongoose.model('UserDetail', UserDetailSchema);
