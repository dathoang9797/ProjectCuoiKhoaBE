import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog, isImage } from '@Utils';
import { ICity, CityModel } from '@Models/CityModel';

const { errorCreateCity, errorDeleteCity, errorUpdateCityById, errorFetchCity } = MessageLog;

export const cityController = {
  getAllCity: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const cities = await CityModel.find();
    if (!cities) return next(new AppErrorHandling(errorFetchCity, 400));
    return res.status(200).json({ status: 'success', data: cities });
  }),

  getCity: catchError(async (req: Request<ICity['_id']>, res: Response, next: NextFunction) => {
    const city = await CityModel.findById(req.params._id);
    if (!city) return next(new AppErrorHandling(errorFetchCity, 400));
    return res.status(200).json({ status: 'success', data: city });
  }),

  createCity: catchError(async (req: Request<{}, {}, ICity>, res: Response, next: NextFunction) => {
    const { city_name } = req.body;
    const city = new CityModel({ city_name });
    if (!city) return next(new AppErrorHandling(errorCreateCity, 400));
    await city.save();
    return res.status(200).json({ status: 'success', data: city });
  }),

  deleteCity: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const city = await CityModel.findByIdAndDelete(req.params._id);
    if (!city) return next(new AppErrorHandling(errorDeleteCity, 400));
    return res.status(200).json({ status: 'success', data: city });
  }),

  updateCity: catchError(async (req: Request<ICity['_id'], {}, ICity>, res: Response, next: NextFunction) => {
    const city = await CityModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!city) return next(new AppErrorHandling(errorUpdateCityById, 400));
    return res.status(200).json({ status: 'success', data: city });
  }),
};