import bcrypt from 'bcrypt';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';

export interface IUser {
  _id: Types.ObjectId;
  avatar: string;
  user_name: string;
  user_password: string;
  type_login: string;
  new_password?: string;
  new_password_confirm?: string;
  password_confirm: string;
  password_resetToken: string;
  password_resetExpires: Date;
  password_changedAt: Date;
  correctPassword: Function;
  changedPasswordAfter: Function;
  createPasswordResetToken: Function;
}

export interface UserToken {
  _id: Types.ObjectId;
  user_name: string;
  type_login: string;
  iat: number;
  exp: number;
}

export const UserSchema = new mongoose.Schema<IUser>({
  user_name: {
    type: String,
    required: [true, 'Please provide user name'],
    lowercase: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  user_password: {
    type: String,
    required: [true, 'Please provide password'],
    validate: [validator.isStrongPassword, 'Please provide a strong password'],
    select: false
  },

  password_confirm: {
    type: String,
    required: [true, 'Please confirm password'],
    validate: {
      validator(this: HydratedDocument<IUser>, el: string) {
        return el === this.user_password;
      },
      message: 'Passwords are not the same!'
    }
  },
  password_changedAt: Date,
  password_resetExpires: Date,
  password_resetToken: String,
  type_login: { type: String, default: 'User', enum: ['User', 'Admin'] },
  avatar: { type: String}
});

UserSchema.pre('save', async function (this: HydratedDocument<IUser>, next) {
  //Only run this function if password was actually modified
  if (!this.isModified('user_password')) return next();

  //Has the password with cost of 12
  this.user_password = await bcrypt.hash(this.user_password, 12);
  //Delete passwordConfirm field
  this.password_confirm = undefined;
  next();
});

// UserSchema.pre('save', async function (this: HydratedDocument<IUser>, next) {
//   if (!this.isModified('user_password') || this.isNew) return next();
//   this.password_changedAt = (Date.now() - 1000) as unknown as Date;
//   next();
// });

UserSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.changedPasswordAfter = function (this: HydratedDocument<IUser>, JWTTimestamp: number) {
  if (this.password_changedAt) {
    const changedTimeStamp = this.password_changedAt.getTime() / 1000;
    return JWTTimestamp < changedTimeStamp;
  }
  //False mean Not changed
  return false;
};

UserSchema.methods.createPasswordResetToken = async function (this: HydratedDocument<IUser>) {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.password_resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.password_resetExpires = (Date.now() + 10 * 60 * 1000) as unknown as Date; //10 minutes
  return resetToken;
};

export const UserModel = mongoose.model('User', UserSchema);
