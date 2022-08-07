import mongoose, { Types } from 'mongoose';

export interface ICity {
  _id: Types.ObjectId;
  city_name: string;
}

export const CitySchema = new mongoose.Schema<ICity>({
  city_name: { type: String, required: [true,'Please provide city'] },
});

export const CityModel = mongoose.model('City', CitySchema);