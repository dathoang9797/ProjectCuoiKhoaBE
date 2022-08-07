import express from 'express';
import { categoryRoute } from './CategoryRouter';
import { menuRoute } from './MenuRouter';
import { userRoute } from './UserRouter';
import { authRoute } from './AuthRouter';
import { cityRoute } from './CityRouter';
import { stateRoute } from './StateRouter';
import { restaurantRoute } from './RestaurantRouter';
import { promoRoute } from './PromoRouter';
import { menuDetailRoute } from './MenuDetailRouter';
import { menuPromoRoute } from './MenuPromoRouter';
import { orderRoute } from './OderRouter';
import { orderDetailRoute } from './OrderDetailRouter';
import { reviewRoute } from './ReviewRouter';
import { statusRoute } from './StatusRouter';
import { subMenuRoute } from './SubMenuRouter';

export const rootRouter = express.Router();

rootRouter.use('/menu', menuRoute);
rootRouter.use('/menu-detail', menuDetailRoute);
rootRouter.use('/menu-promo', menuPromoRoute);

rootRouter.use('/order', orderRoute);
rootRouter.use('/order-detail', orderDetailRoute);

rootRouter.use('/review', reviewRoute);
rootRouter.use('/restaurant', restaurantRoute);

rootRouter.use('/status', statusRoute);
rootRouter.use('/sub-menu', subMenuRoute);
rootRouter.use('/state', stateRoute);

rootRouter.use('/city', cityRoute);
rootRouter.use('/category', categoryRoute);

rootRouter.use('/user', userRoute);
rootRouter.use('/auth', authRoute);
rootRouter.use('/promo', promoRoute);
