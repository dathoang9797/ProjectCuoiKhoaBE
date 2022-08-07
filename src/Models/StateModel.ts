import mongoose, { Types } from 'mongoose';

export interface IState {
  _id: Types.ObjectId;
  state_name: string;
}

export const StateSchema = new mongoose.Schema<IState>({
  state_name: { type: String, required: [true, 'Please provide state'] },
});

export const StateModel = mongoose.model('State', StateSchema);
