import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog, isImage } from '@Utils';
import { IPromo, PromoModel } from '@Models/PromoModel';

const { errorCreatePromo, errorDeletePromo, errorUpdatePromoById, errorFetchPromo, } = MessageLog;

export const promoController = {
    getAllPromo: catchError(async (req: Request, res: Response, next: NextFunction) => {
        const Promos = await PromoModel.find();
        if (!Promos) return next(new AppErrorHandling(errorFetchPromo, 400));
        return res.status(200).json({ status: 'success', data: Promos });
    }),

    getPromo: catchError(async (req: Request<IPromo['_id']>, res: Response, next: NextFunction) => {
        const Promo = await PromoModel.findById(req.params._id);
        if (!Promo) return next(new AppErrorHandling(errorFetchPromo, 400));
        return res.status(200).json({ status: 'success', data: Promo });
    }),

    createPromo: catchError(async (req: Request<{}, {}, IPromo>, res: Response, next: NextFunction) => {
        const { discount, name, expired_date } = req.body;
        const promo = new PromoModel({ discount, name, expired_date });
        if (!promo) return next(new AppErrorHandling(errorCreatePromo, 400));
        await promo.save();
        return res.status(200).json({ status: 'success', data: promo });
    }),

    deletePromo: catchError(async (req: Request, res: Response, next: NextFunction) => {
        const promo = await PromoModel.findByIdAndDelete(req.params._id);
        if (!promo) return next(new AppErrorHandling(errorDeletePromo, 400));
        return res.status(200).json({ status: 'success', data: promo });
    }),

    updatePromo: catchError(async (req: Request<IPromo['_id'], {}, IPromo>, res: Response, next: NextFunction) => {
        const promo = await PromoModel.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true });
        if (!promo) return next(new AppErrorHandling(errorUpdatePromoById, 400));
        return res.status(200).json({ status: 'success', data: promo });
    }),
};
