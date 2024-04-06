import jwt from "jsonwebtoken";
import { IUserSchema } from "../interfaces/user.interface";
import userMessage from "../messages/user.messages";

const generateToken = (
  data: object = {},
  expiresIn: string = String(process.env.JWT_EXP_DURATION),
  secretKey: string = String(process.env.JWT_PRIVATE_KEY)
) => {
  return jwt.sign(data, secretKey, { expiresIn });
};

const decodeToken = (token: string) => {
  return jwt.decode(token) as any;
};

const verifyToken = (token: string) => {
  try {
    const data = jwt.verify(
      token,
      String(process.env.JWT_PRIVATE_KEY)
    ) as IUserSchema;
    return {
      data,
      status: 200,
      message: userMessage.USER_JWT_VERIFIED,
      error: false,
      tokenExpired: false,
    };
  } catch (error) {
    const { message } = error as Error;

    if (message === "jwt expired") {
      return {
        data: decodeToken(token) as IUserSchema,
        status: 201,
        message: userMessage.USER_JWT_EXPIRED,
        error: true,
        tokenExpired: true,
      };
    }

    return {
      data: null,
      status: 401,
      message: userMessage.USER_JWT_INVALID,
      error: true,
      tokenExpired: false,
    };
  }
};

export { decodeToken, generateToken, verifyToken };
