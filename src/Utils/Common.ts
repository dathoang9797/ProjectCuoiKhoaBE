import { IUser } from '@Models/UserModel';
import { IUserDetail } from '@Models/UserDetailModel';

type FilterObj = Pick<IUser & IUserDetail, 'full_name' | 'phone' | 'user_name' | 'street' | 'city' | 'state' | 'avatar'>;

export const filterObj = (obj: IUser & IUserDetail, ...allowedFields: string[]) => {
  const newObj = {} as FilterObj;
  Object.keys(obj).forEach((el: keyof FilterObj) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el as keyof FilterObj];
  });
  return newObj;
};

export const isImage = (url: string) => /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
