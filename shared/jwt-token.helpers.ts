import { IUser } from '../interfaces/user.interface';
import jwt from 'jsonwebtoken';
import userMessage from '../messages/user.messages';

const generateToken = (data: object = {}, 
  expiresIn: string = String(process.env.JWT_EXP_DURATION),
  secretKey: string = String(process.env.JWT_PRIVATE_KEY)) => {
  return jwt.sign(data, secretKey, { expiresIn });
};

const decodeToken = (token: string) => {
  return jwt.decode(token);
}

const verifyToken = (token: string) => {
  try {
    const data = jwt.verify(token, String(process.env.JWT_PRIVATE_KEY)) as IUser;
    return {
      data,
      message: userMessage.USER_JWT_VERIFIED,
      error: false,
      tokenExpired: false
    };

  } catch (error) {
    const { message } = error as Error;
    
    if (message === "jwt expired") {
      return {
        data: decodeToken(token) as IUser,
        message: userMessage.USER_JWT_EXPIRED,
        error: true,
        tokenExpired: true
      }
    }

    return {
      data: null,
      message: userMessage.USER_JWT_INVALID,
      error: true,
      tokenExpired: false
    }
  }
};

export {
  generateToken,
  decodeToken,
  verifyToken
};
