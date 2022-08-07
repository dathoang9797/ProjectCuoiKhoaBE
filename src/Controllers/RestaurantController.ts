import sharp from 'sharp';
import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog, isImage, uploadImage } from '@Utils';
import { IRestaurant, RestaurantModel } from '@Models/RestaurantModel';

const { errorCreateRestaurant, errorDeleteRestaurant, errorUpdateRestaurantById, errorFetchRestaurant, errorInvalidImage } = MessageLog;

export const restaurantController = {
  getAllRestaurant: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const restaurants = await RestaurantModel.find();
    if (!restaurants) return next(new AppErrorHandling(errorFetchRestaurant, 400));
    return res.status(200).json({ status: 'success', data: restaurants });
  }),

  getRestaurant: catchError(async (req: Request<IRestaurant['_id']>, res: Response, next: NextFunction) => {
    const restaurant = await RestaurantModel.findById(req.params._id);
    if (!restaurant) return next(new AppErrorHandling(errorFetchRestaurant, 400));
    return res.status(200).json({ status: 'success', data: restaurant });
  }),

  createRestaurant: catchError(async (req: Request<{}, {}, IRestaurant>, res: Response, next: NextFunction) => {
    const { restaurant_name } = req.body;
    const restaurant = new RestaurantModel({ restaurant_name });
    if (!restaurant) return next(new AppErrorHandling(errorCreateRestaurant, 400));
    await restaurant.save();
    return res.status(200).json({ status: 'success', data: restaurant });
  }),

  deleteRestaurant: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const restaurant = await RestaurantModel.findByIdAndDelete(req.params._id);
    if (!restaurant) return next(new AppErrorHandling(errorDeleteRestaurant, 400));
    return res.status(200).json({ status: 'success', data: restaurant });
  }),

  updateRestaurant: catchError(async (req: Request<IRestaurant['_id'], {}, IRestaurant>, res: Response, next: NextFunction) => {
    const restaurant = await RestaurantModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!restaurant) return next(new AppErrorHandling(errorUpdateRestaurantById, 400));
    return res.status(200).json({ status: 'success', data: restaurant });
  }),

  uploadRestaurantImages: uploadImage.fields([{ name: 'url_img', maxCount: 3 }]),

  resizeRestaurantImages: catchError(async (req: Request<IRestaurant['_id'], {}, IRestaurant>, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files['url_img']) return next();
    req.body.url_img = [];
    await Promise.all(
      files['url_img'].map(async (file, index) => {
        const filename = `restaurant-${req.params._id}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(file.buffer).resize(1920, 1080).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/restaurant/${filename}`);
        req.body.url_img.push(filename);
      })
    );
    next();
  })
};
