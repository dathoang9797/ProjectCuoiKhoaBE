import { IUser as IUserModel } from '@Models/UserModel';
import { Document, Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: Document<unknown, any, IUserModel> & IUserModel & { _id: Types.ObjectId };
    }
  }
}
