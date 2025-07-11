import httpStatus from 'http-status';
import CustomError from '../../errors/customError';
import generateToken from '../../utils/generateToken';
import { IUser } from './user.interface';
import User from './user.model';
import bcrypt from 'bcrypt';

class UserServices {
  private model = User;

  async getSelf(userId: string) {
    return this.model.findById(userId);
  }

  async register(payload: IUser) {
    const user = await this.model.create(payload);
    const token = generateToken({ _id: user._id, email: user.email });
    return { token };
  }

  async login(payload: { email: string; password: string }) {
    const user = await this.model.findOne({ email: payload.email }).select('+password');

    if (!user) {
      throw new CustomError(httpStatus.BAD_REQUEST, 'Invalid email or password');
    }

    const isMatched = await bcrypt.compare(payload.password, user.password);
    if (!isMatched) {
      throw new CustomError(httpStatus.BAD_REQUEST, 'Invalid email or password');
    }

    const token = generateToken({ _id: user._id, email: user.email });
    return { token };
  }

  async updateProfile(id: string, payload: Partial<IUser>) {
    return this.model.findByIdAndUpdate(id, payload);
  }

  async changePassword(userId: string, payload: { oldPassword: string; newPassword: string }) {
    const user = await this.model.findById(userId).select('+password');
    if (!user) throw new CustomError(httpStatus.NOT_FOUND, 'User not found');

    const matchedPassword = await bcrypt.compare(payload.oldPassword, user.password);
    if (!matchedPassword) {
      throw new CustomError(400, 'Old Password does not matched!');
    }

    const hashedPassword = await bcrypt.hash(payload.newPassword, 10);
    const updatedUser = await this.model.findByIdAndUpdate(userId, { password: hashedPassword });

    return updatedUser;
  }
}

const userServices = new UserServices();
export default userServices;
