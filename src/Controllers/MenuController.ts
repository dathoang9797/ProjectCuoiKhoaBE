import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import { catchError, AppErrorHandling, MessageLog, isImage, uploadImage } from '@Utils';
import { IMenu, MenuModel } from '@Models/MenuModel';

const { errorFetchMenu, errorDeleteMenu, errorInvalidImage, errorCreateMenu, errorUpdateMenuById } = MessageLog;

export const menuController = {
  getAllMenu: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const menus = await MenuModel.find();
    if (!menus) return next(new AppErrorHandling(errorFetchMenu, 400));
    return res.status(200).json({ status: 'success', data: menus });
  }),

  getMenu: catchError(async (req: Request<IMenu['_id']>, res: Response, next: NextFunction) => {
    const menu = await MenuModel.findById(req.params._id);
    if (!menu) return next(new AppErrorHandling(errorFetchMenu, 400));
    return res.status(200).json({ status: 'success', data: menu });
  }),

  createMenu: catchError(async (req: Request<{}, {}, IMenu>, res: Response, next: NextFunction) => {
    const { menu_description, menu_name, menu_type, price, rating, url_img } = req.body;
    if (url_img?.length > 0 && url_img.some((img) => !isImage(img))) {
      return next(new AppErrorHandling(errorInvalidImage, 400));
    }
    const menu = new MenuModel({ menu_description, menu_name, menu_type, price, rating, url_img });
    if (!menu) return next(new AppErrorHandling(errorCreateMenu, 400));
    await menu.save();
    return res.status(200).json({ status: 'success', data: menu });
  }),

  deleteMenu: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const menu = await MenuModel.findByIdAndDelete(req.params._id);
    if (!menu) return next(new AppErrorHandling(errorDeleteMenu, 400));
    return res.status(200).json({ status: 'success', data: menu });
  }),

  updateMenu: catchError(async (req: Request<IMenu['_id'], {}, IMenu>, res: Response, next: NextFunction) => {
    const menu = await MenuModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!menu) return next(new AppErrorHandling(errorUpdateMenuById, 400));
    return res.status(200).json({ status: 'success', data: menu });
  }),

  uploadMenuImages: uploadImage.fields([{ name: 'url_img', maxCount: 3 }]),

  resizeMenuImages: catchError(async (req: Request<IMenu, {}, IMenu>, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files['url_img']) return next();
    req.body.url_img = [];
    await Promise.all(
      files['url_img'].map(async (file, index) => {
        const filename = `menu-${req.params._id}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(file.buffer).resize(1920, 1080).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/menu/${filename}`);
        req.body.url_img.push(filename);
      })
    );
    next();
  })
};
