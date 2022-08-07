import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import { catchError, AppErrorHandling, MessageLog, isImage, uploadImage } from '@Utils';
import { ICategory, CategoryModel } from '@Models/CategoryModel';

const { errorCreateCategory, errorDeleteCategory, errorUpdateCategoryById, errorFetchCategory, errorInvalidImage } = MessageLog;

export const categoryController = {
  getAllCategory: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const categories = await CategoryModel.find();
    if (!categories) return next(new AppErrorHandling(errorFetchCategory, 400));
    return res.status(200).json({ status: 'success', data: categories });
  }),

  getCategory: catchError(async (req: Request<ICategory['_id']>, res: Response, next: NextFunction) => {
    const Category = await CategoryModel.findById(req.params._id);
    if (!Category) return next(new AppErrorHandling(errorFetchCategory, 400));
    return res.status(200).json({ status: 'success', data: Category });
  }),

  createCategory: catchError(async (req: Request<{}, {}, ICategory>, res: Response, next: NextFunction) => {
    const { url_img, category_name } = req.body;
    if (url_img?.length > 0 && url_img.some((img) => !isImage(img))) {
      return next(new AppErrorHandling(errorInvalidImage, 400));
    }
    const Category = new CategoryModel({ url_img, category_name });
    if (!Category) return next(new AppErrorHandling(errorCreateCategory, 400));
    await Category.save();
    return res.status(200).json({ status: 'success', data: Category });
  }),

  deleteCategory: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const Category = await CategoryModel.findByIdAndDelete(req.params._id);
    if (!Category) return next(new AppErrorHandling(errorDeleteCategory, 400));
    return res.status(200).json({ status: 'success', data: Category });
  }),

  updateCategory: catchError(async (req: Request<ICategory['_id'], {}, ICategory>, res: Response, next: NextFunction) => {
    const Category = await CategoryModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!Category) return next(new AppErrorHandling(errorUpdateCategoryById, 400));
    return res.status(200).json({ status: 'success', data: Category });
  }),

  uploadCategoryImages: uploadImage.fields([{ name: 'url_img', maxCount: 3 }]),

  resizeCategoryImages: catchError(async (req: Request<ICategory, {}, ICategory>, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (!files['url_img']) return next();
    req.body.url_img = [];
    await Promise.all(
      files['url_img'].map(async (file, index) => {
        const filename = `category-${req.params._id}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(file.buffer).resize(1920, 1080).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/category/${filename}`);
        req.body.url_img.push(filename);
      })
    );
    next();
  })
};
