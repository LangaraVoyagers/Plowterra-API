import { Request, Response } from "express";
import { generateToken, verifyToken } from "../shared/jwt-token.helpers";

import bcrypt from "bcrypt";
import userMessage from "../messages/user.messages";
import Farm from "../models/Farm";
import User from "../models/User";

// signUp a user
async function signUp(req: Request, res: Response) {
  try {
    const checkUser = await User.findOne({ email: req.body?.email }).exec();

    // if user email is already present
    if (checkUser?._id) {
      res.json({
        message: userMessage.USER_CREATE_ACCOUNT_EXISTS,
        data: null,
        error: true,
      });

      return;
    }

    const farm = await Farm.findById(req.body?.farmId).exec();

    // if invalid farmId was passed
    if (!farm?._id) {
      res.json({
        message: userMessage.USER_CREATE_FARM_ID_ERROR,
        data: null,
        error: true,
      });

      return;
    }

    const user = await new User({
      name: req.body?.name,
      email: req.body?.email,
      password: req.body?.password,
      farm: req.body?.farmId,
    }).save();

    // add user to the farm
    await Farm.findByIdAndUpdate(req.body?.farmId, {
      $push: { users: user._id },
    }).exec();

    const savedUser = await User.findById(user._id)
      .populate({
        path: "farm",
        model: "Farm",
        select: "-userIds -users",
      })
      .select("-token")
      .exec();

    res.status(201).json({
      message: userMessage.USER_CREATE_SUCCESS,
      data: savedUser,
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: userMessage.USER_CREATE_ERROR,
      data: null,
      error: true,
    });
  }
}

// signIn a user
async function signIn(req: Request, res: Response) {
  try {
    // get the user info
    const user = await User.findOne({ email: req.body?.email })
      .populate({
        path: "farm",
        model: "Farm",
        select: "-userIds -users",
      })
      .exec();

    // get user farm info
    const farm = await Farm.findById(user?.id).exec();

    // verify the token
    // const verificationData = verifyToken(user?.token ?? "");

    // // user is already logged in
    // if (!verificationData.error && !verificationData.tokenExpired) {
    //   res.status(406).json({
    //     message: userMessage.USER_ALREADY_LOGGED_IN,
    //     data: null,
    //     error: true
    //   });

    //   return;
    // }

    // user was not found
    if (!user?._id) {
      res.status(401).json({
        message: userMessage.USER_EMAIL_PASSWORD_MISS_MATCH,
        data: null,
        error: true,
      });

      return;
    }

    // user account was disabled
    if (user?.isDisabled) {
      res.status(409).json({
        message: userMessage.USER_LOGIN_DISABLED,
        data: null,
        error: true,
      });

      return;
    }

    // farm account was disabled
    if (farm?.isDisabled) {
      res.status(409).json({
        message: userMessage.USER_FARM_DISABLED,
        data: null,
        error: true,
      });

      return;
    }

    // check if hashed password and current passwords match
    const isPasswordMatch = await bcrypt.compare(
      String(req.body?.password),
      user!.password
    );

    // if passwords didnot match
    if (!isPasswordMatch) {
      res.status(401).json({
        message: userMessage.USER_EMAIL_PASSWORD_MISS_MATCH,
        data: null,
        error: true,
      });

      return;
    }

    // create JWT token
    const token = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      farm: user.farm,
    });

    // update the token in DB
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { token },
      { returnDocument: "after", runValidators: true }
    ).exec();

    res.status(200).json({
      message: userMessage.USER_LOGIN_SUCCESS,
      data: {
        token: updatedUser?.token,
        user: {
          name: user.name,
          farm: user.farm,
        },
      },
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: userMessage.USER_LOGIN_ERROR,
      data: null,
      error: true,
    });
  }
}

// logout the user
async function logOut(req: Request, res: Response) {
  try {
    const { user } = res.locals;
    // unset the token
    const updatedUser = await User.findByIdAndUpdate(
      user?.id,
      { token: null },
      { returnDocument: "after", runValidators: true }
    ).exec();

    res.status(200).json({
      message: userMessage.USER_LOGOUT_SUCCESS,
      data: { token: updatedUser?.token },
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: userMessage.USER_LOGOUT_ERROR,
      data: null,
      error: true,
    });
  }
}

// refresh the token
async function refreshToken(req: Request, res: Response) {
  try {
    // get the token from the headers
    const { authorization } = req.headers;
    // verify the token
    const verificationData = verifyToken(authorization ?? "");

    if (!verificationData?.tokenExpired) {
      res.status(Number(verificationData?.status)).json({
        message: verificationData.message,
        data: verificationData.data,
        error: true,
      });

      return;
    }

    // extract data
    const { data } = verificationData;
    // get user info
    const user = await User.findById(data?.id).exec();

    // token in DB doesn't match with current token
    if (!(user?.token === authorization)) {
      res.status(401).json({
        message: userMessage.USER_JWT_INVALID,
        data: null,
        error: true,
      });

      return;
    }

    // generate new token
    const token = generateToken({
      id: data?.id,
      name: data?.name,
      email: data?.email,
      farm: data?.farm,
    });

    // update the token on login
    const updatedUser = await User.findByIdAndUpdate(
      data?.id,
      { token },
      { returnDocument: "after", runValidators: true }
    ).exec();

    res.status(201).json({
      message: userMessage.USER_JWT_REFRESH_SUCCESS,
      data: { token: updatedUser?.token },
      error: false,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: userMessage.USER_JWT_REFRESH_ERROR,
      data: null,
      error: true,
    });
  }
}

const authenticationController = {
  signIn,
  signUp,
  logOut,
  refreshToken,
};

export default authenticationController;
