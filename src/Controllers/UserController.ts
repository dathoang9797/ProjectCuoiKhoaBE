import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog, filterObj, uploadImage } from '@Utils';
import { UserModel, IUser } from '@Models/UserModel';
import { UserDetailModel, IUserDetail } from '@Models/UserDetailModel';
import sharp from 'sharp';

const { errorCreateUser, errorFetchUsers, errorWrongRouteUpdate, errorDeleteUser, errorUpdateUser, errorUpdateProfile } = MessageLog;

export const userController = {
  getAllUser: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const User = await UserModel.find();
    if (!User) return next(new AppErrorHandling(errorFetchUsers, 400));
    return res.status(200).json({ status: 'success', data: User });
  }),

  getUser: catchError(async (req: Request<IUserDetail['_id']>, res: Response, next: NextFunction) => {
    const user = await UserModel.findById(req.user._id);
    const userDetail = await UserDetailModel.findOneAndDelete({ id_user: req.user._id });
    const data = { userDetail, id_user: user };
    if (!data) return next(new AppErrorHandling(errorFetchUsers, 400));
    return res.status(200).json({ status: 'success', data });
  }),

  deleteUser: catchError(async (req: Request<IUserDetail['_id']>, res: Response, next: NextFunction) => {
    const UserDetail = await UserDetailModel.findByIdAndDelete(req.params._id).populate(['id_user']);
    if (!UserDetail) return next(new AppErrorHandling(errorDeleteUser, 400));
    return res.status(200).json({ status: 'success', data: UserDetail });
  }),

  deleteUserProfile: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findByIdAndDelete(req.user._id);
    const userDetail = await UserDetailModel.findOneAndDelete({ id_user: req.user._id });
    const data = { userDetail, id_user: user };
    if (!data) return next(new AppErrorHandling(errorDeleteUser, 400));
    return res.status(200).json({ status: 'success', data });
  }),

  updateProfile: catchError(async (req: Request<{}, {}, IUserDetail & IUser>, res: Response, next: NextFunction) => {
    const { city, full_name, phone, state, street, user_name, user_password, password_confirm, password_changedAt } = req.body;
    const id_user = req.user._id;
    const User = new UserModel({ user_name, user_password, password_confirm, password_changedAt });
    const UserDetail = new UserDetailModel({ id_user, full_name, phone, street, city, state });
    await User.save();
    await UserDetail.save();
    if (!UserDetail) return next(new AppErrorHandling(errorUpdateProfile, 400));
    const data = UserDetail.populate(['id_user']);
    return res.status(200).json({ status: 'success', data });
  }),

  updateUser: catchError(async (req: Request<{ _id: string }, {}, IUserDetail & IUser>, res: Response, next: NextFunction) => {
    const { user_password, password_confirm } = req.body;
    if (user_password || password_confirm) {
      return next(new AppErrorHandling(errorWrongRouteUpdate, 400));
    }
    const { _id } = req.params;
    const filteredBody = filterObj(req.body, 'user_name', 'full_name', 'phone', 'street', 'city', 'state');
    if (req?.file) filteredBody.avatar = req.file.filename;

    const { full_name, phone, street, user_name, city, state, avatar } = filteredBody;
    const fieldUpdateUserDetail = { full_name, phone, street, city, state };
    const fieldUpdateUser = { user_name, avatar };
    const userDetail = await UserDetailModel.findOneAndUpdate({ id_user: _id }, fieldUpdateUserDetail, {
      new: true,
      runValidators: true
    });
    const user = await UserModel.findByIdAndUpdate(_id, fieldUpdateUser, { new: true, runValidators: true });
    if (!user) return next(new AppErrorHandling(errorUpdateUser, 400));
    const data = userDetail ? userDetail.populate(['id_user']) : user;
    if (!data) return res.status(200).json({ status: 'success', userDetail });
    return res.status(200).json({ status: 'success', data });
  }),

  createUser: catchError(async (req: Request<{}, {}, IUserDetail & IUser>, res: Response, next: NextFunction) => {
    const { city, full_name, phone, state, street, user_name, user_password, password_confirm, password_changedAt, type_login } = req.body;
    const User = new UserModel({ user_name, user_password, password_confirm, password_changedAt, type_login });
    const id_user = User._id;
    const UserDetail = new UserDetailModel({ id_user, full_name, phone, street, city, state });
    await User.save();
    await UserDetail.save();
    if (!UserDetail) return next(new AppErrorHandling(errorCreateUser, 400));
    const data = UserDetail.populate(['id_user']);
    return res.status(200).json({ status: 'success', data });
  }),

  uploadUserAvatar: uploadImage.single('avatar'),

  resizeUserPhoto: catchError(async (req: Request<{}, {}, IUserDetail & IUser>, res: Response, next: NextFunction) => {
    if (!req.file) next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/img/users/${req.file.filename}`);
    next();
  })
};
