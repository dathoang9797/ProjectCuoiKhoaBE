import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { catchError, AppErrorHandling, MessageLog, createSendToken, sendEmail } from '@Utils';
import { UserModel, IUser, UserToken } from '@Models/UserModel';

interface ParamResetToken {
  token: string;
}

const {
  errorSignUp,
  errorProvideEmailOrPassword,
  errorIncorrectPassword,
  errorNotHaveToken,
  errorTokenNoLongerExist,
  errorTokenChangedPassword,
  errorNotHavePermission,
  errorNoUserWithUserName,
  errorSendingEmail,
  messageSubjectEmailResetPassword,
  messageTokenSentToEmail,
  errorTokenInvalidOrHasExpired,
  errorFetchUsers,
  messageForgotPassword
} = MessageLog;

export const authController = {
  signUp: catchError(async (req: Request<{}, {}, IUser>, res: Response, next: NextFunction) => {
    const { user_name, user_password, password_confirm, password_changedAt, type_login } = req.body;
    const user = new UserModel({ user_name, user_password, password_confirm, password_changedAt, type_login });
    if (!user) return next(new AppErrorHandling(errorSignUp, 400));
    await user.save();
    return createSendToken(user, 200, res);
  }),

  signIn: catchError(async (req: Request<{}, {}, IUser>, res: Response, next: NextFunction) => {
    const { user_password, user_name } = req.body;
    if (!user_password || !user_name) {
      return next(new AppErrorHandling(errorProvideEmailOrPassword, 400));
    }
    // Check if user exists && password is correct
    const user = await UserModel.findOne({ user_name }).select('+user_password');
    if (!user) return next(new AppErrorHandling(errorFetchUsers, 401));
    const correct = await user.correctPassword(user_password, user.user_password);
    if (!user || !correct) return next(new AppErrorHandling(errorIncorrectPassword, 401));
    return createSendToken(user, 200, res);
  }),

  protect: catchError(async (req: Request, res: Response, next: NextFunction) => {
    const token = req?.headers?.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];

    //1) Getting token and check of it's there
    if (!token || token === 'null') {
      return next(new AppErrorHandling(errorNotHaveToken, 401));
    }

    //2) Verification token
    const decoded = (await Promise.resolve(jwt.verify(token, process.env.JWT_SECRET))) as UserToken;

    //3) Check if user still exists when admin delete user in DB
    const currentUser = await UserModel.findById(decoded._id);
    if (!currentUser) {
      return next(new AppErrorHandling(errorTokenNoLongerExist, 401));
    }

    //4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(new AppErrorHandling(errorTokenChangedPassword, 401));
    }
    req.user = currentUser;
    next();
  }),

  restrictTo: (...type_login: string[]) => {
    return catchError(async (req: Request, res: Response, next: NextFunction) => {
      //roles [ 'User','Admin']
      if (!type_login.includes(req.user.type_login)) {
        return next(new AppErrorHandling(errorNotHavePermission, 401));
      }
      next();
    });
  },

  forgotPassword: catchError(async (req: Request<{}, {}, IUser>, res: Response, next: NextFunction) => {
    //  1)Get user based on POSTed email
    const user = await UserModel.findOne({ user_name: req.body.user_name });

    if (!user) return next(new AppErrorHandling(errorNoUserWithUserName, 401));

    // 2) Generate the random reset token
    const resetToken = await user.createPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    //3) Send it to user's email
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/forgotpassword/${resetToken}`;
    const message = messageForgotPassword(resetUrl);

    try {
      await sendEmail({
        email: user.user_name,
        subject: messageSubjectEmailResetPassword,
        message
      });
      res.status(200).json({
        status: 'success',
        message: messageTokenSentToEmail,
        resetUrl,
        subject: messageSubjectEmailResetPassword
      });
    } catch (error) {
      user.password_resetExpires = undefined;
      user.password_resetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppErrorHandling(errorSendingEmail, 500));
    }
  }),

  resetPassword: catchError(async (req: Request<ParamResetToken, {}, IUser>, res: Response, next: NextFunction) => {
    // 1)Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await UserModel.findOne({ password_resetToken: hashedToken, password_resetExpires: { $gt: Date.now() } });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) return next(new AppErrorHandling(errorTokenInvalidOrHasExpired, 400));
    user.user_password = req.body.user_password;
    user.password_confirm = req.body.password_confirm;
    user.password_resetToken = undefined;
    user.password_resetExpires = undefined;

    // 3) Update changedPasswordAt property for the user
    user.password_changedAt = (Date.now() - 1000) as unknown as Date;

    await user.save();
    // 4) Log the user in send JWT
    return createSendToken(user, 200, res);
  }),

  updatePassword: catchError(async (req: Request<IUser['_id'], {}, IUser>, res: Response, next: NextFunction) => {
    const { user_password, new_password, new_password_confirm } = req.body;
    const user = await UserModel.findById(req.user._id).select('+user_password');
    const correct = await user.correctPassword(user_password, user.user_password);
    if (!user || !correct) return next(new AppErrorHandling(errorIncorrectPassword, 400));
    // 3) Update password
    user.user_password = new_password;
    user.password_confirm = new_password_confirm;
    await user.save();
    // 4) Log user in sendJWT
    return createSendToken(user, 200, res);
  })
};
