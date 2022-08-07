import mongoose, { Types } from 'mongoose';

export interface IStatus {
  _id: Types.ObjectId;
  name: string;
}

export const StatusSchema = new mongoose.Schema<IStatus>({
  name: { type: String, required: [true, 'Please provide status'] }
});

export const StatusModel = mongoose.model('Status', StatusSchema);
