import mongoose, { Types } from 'mongoose';

export interface IRestaurant {
  _id: Types.ObjectId;
  restaurant_name: string;
  url_img: string[];
}

export const RestaurantSchema = new mongoose.Schema<IRestaurant>({
  restaurant_name: { type: String, required: true },
  url_img: [String]
});

export const RestaurantModel = mongoose.model('Restaurant', RestaurantSchema);
