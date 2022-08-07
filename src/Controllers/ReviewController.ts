import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog } from '@Utils';
import { IReview, ReviewModel } from '@Models/ReviewModel';

const { errorCreateReview, errorDeleteReview, errorUpdateReviewById, errorFetchReview } = MessageLog;

export const reviewController = {
  getAllReviews: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await ReviewModel.find();
    if (!reviews) return next(new AppErrorHandling(errorFetchReview, 400));
    return res.status(200).json({ status: 'success', data: reviews });
  }),

  getReview: catchError(async (req: Request<IReview['_id']>, res: Response, next: NextFunction) => {
    const review = await ReviewModel.findById(req.params._id);
    if (!review) return next(new AppErrorHandling(errorFetchReview, 400));
    return res.status(200).json({ status: 'success', data: review });
  }),

  createReview: catchError(async (req: Request<{}, {}, IReview>, res: Response, next: NextFunction) => {
    const { id_res, id_user, rating, review_comment } = req.body;
    const review = new ReviewModel({ id_res, id_user, rating, review_comment });
    if (!review) return next(new AppErrorHandling(errorCreateReview, 400));
    await review.save();
    return res.status(200).json({ status: 'success', data: review });
  }),

  deleteReview: catchError(async (req: Request<IReview['_id']>, res: Response, next: NextFunction) => {
    const review = await ReviewModel.findByIdAndDelete(req.params._id);
    if (!review) return next(new AppErrorHandling(errorDeleteReview, 400));
    return res.status(200).json({ status: 'success', data: review });
  }),

  updateReview: catchError(async (req: Request<IReview['_id'], {}, IReview>, res: Response, next: NextFunction) => {
    const review = await ReviewModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
    if (!review) return next(new AppErrorHandling(errorUpdateReviewById, 400));
    return res.status(200).json({ status: 'success', data: review });
  })
};
