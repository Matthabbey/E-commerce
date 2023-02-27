import express, { NextFunction, Request, Response } from "express";
import { UserInstance, UserModel } from "../models/userModel";
import bcrypt from "bcrypt";
import {
  createPasswordResetToken,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  option,
  registerSchema,
  validateMongoId,
} from "../utilities/utils";
import crypto from "crypto";
import { GenerateRefreshToken } from "../config/refreshToken";
import { mailSent } from "../utilities/sendMail";
import { FromAdminMail, userSubject } from "../config";

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, password, email, confirm_password } =
      req.body;

    const validateResult = registerSchema.validate(req.body, option);

    if (validateResult.error) {
      return res.status(400).json({
        Error: validateResult.error.details[0].message,
      });
    }

    //Generate Salt
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    const findUser = await UserModel.findOne({ email: email });
    if (!findUser) {
      const newUser = await UserModel.create({
        firstName,
        lastName,
        phone,
        password: userPassword,
        email,
        salt,
      });
      return res.status(201).json({
        messsage: "User successfully created",
        newUser,
      });
    }
    return res.status(400).json({
      message: "User already exit",
    });
  } catch (error) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "/user/signup",
    });
    console.log(error);
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    //Check if the user exist
    const User = await UserModel.findOne({ email });
    if (User) {
      const refreshToken = await GenerateRefreshToken(User?._id);

      const updateUser = await UserModel.findOneAndUpdate(
        User?._id,
        {
          refreshToen: refreshToken,
        },
        {
          new: true,
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      console.log(refreshToken);
    }

    const validation = await bcrypt.compare(password, User!.password);
    if (validation) {
      const signature = await GenerateSignature({
        _id: User?._id,
        email: User?.email,
      });
      // const validation = await bcrypt.compare(password, User?.password)
      return res.status(200).json({
        message: "You have successfully logged in",
        email: User?.email,
        signature,
      });
    }
    return res
      .status(400)
      .json({ message: "Wrong Username or password / not varified user" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      Error: "Internal server Error",
      route: "/user/signup",
    });
  }
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies.refreshToken) {
    return res.status(404).json({ message: "No Refresh Token in Cookies" });
  }
  const refreshToken = cookies.refreshToken;

  const user = await UserModel.findOne({ refreshToken });
  if (!user) {
    return res
      .status(404)
      .json({ message: "No Refresh Token in db or not matched" });
  }
  const accessToken = await GenerateRefreshToken(refreshToken);

  return res.json(accessToken);
};

export const Logout = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies.refreshToken) {
    return res.status(404).json({ message: "No Refresh Token in Cookies" });
  }
  const refreshToken = cookies.refreshToken;
  const user = await UserModel.findOneAndUpdate({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }
  await UserModel.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204);
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const users = await UserModel.find();
    return res.status(200).json({
      message: "You have successfully retrieved all users in your database",
      User: users,
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "users/get-all-users",
    });
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const users = await UserModel.findById(req.params.id);
    return res.status(200).json({
      message: "You have successfully retrieved all users in your database",
      User: users,
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "users/get-all-users",
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  validateMongoId(id);
  try {
    const update = await UserModel.findByIdAndUpdate(id, req.body);
    return res.status(200).json({
      message: "Successfully updated",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      route: "todo/update router",
    });
  }
};

/** ========================DELETE TODO LIST ============================*/
export const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  validateMongoId(id);
  try {
    const deleteMe = await UserModel.findByIdAndDelete(id);

    if (!deleteMe) {
      return res.status(404).json({
        message: "This item has been deleted",
      });
    }
    return res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      route: "user/delete router",
    });
  }
};

export const blockedUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const blocked = await UserModel.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    return res.status(200).json({
      message: `This user is blocked`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Internal error ${error}`,
      route: "user/delete router",
    });
  }
};

/*================= forgot Password ================*/

// export const UpdatePassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const { email } = req.body;
//     const message = `${email}`
//     const user = (await UserModel.findOne({
//       where: { email: email },
//     })) as unknown as UserInstance;
//     if (!user) {
//       // __TEST MESSAGE__ wrong message this should be an error
//       return res.status(200).json({
//         code: 200,
//         message: "Check Your Email to Continue !!",
//       });
//     } else {
//       const otp = await GenerateSalt();
//       let token = await GenerateSignature({
//         email,
//         otp,
//       });
//       await UserModel.findOneAndUpdate(
//         {
//           otp: otp,
//         },
//         {
//           where: { _id: user._id },
//         }
//       );
//     await mailSent(FromAdminMail, email, userSubject, message);

//       // __TEST MESSAGE__ dont send token as response or user will be able to reset pwd without checking email
//       res.status(200).json({
//         code: 200,
//         signature: token,
//         message: "Check Your Email to Continue !!",
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

export const UpdatePassword = async (req: Request, res: Response) => {
  const { _id } = req.user;
  // console.log(_id);
  try {
    const { password } = req.body;
    validateMongoId(_id);
    // const newPassword : any =  await createPasswordResetToken(password)
    const user = await UserModel.findById(_id);
    if (password) {
      user!.password = password;
      const updatedtPassword = await user?.save();
      return res
        .status(200)
        .json({ message: "Password Successfully Updated", updatedtPassword });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: `Internal error ${error}`,
      route: "user/update-password router",
    });
  }
};

export const ForgotPasswordToken = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "There is no user with this email",
    });
  }
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset your password.This link is valid till 10 minutes from now. <a href='https://localhost:4000/api/users/reset-password/${token}'>Please Click Here</a>`;
    await mailSent(FromAdminMail, email, userSubject, resetURL);
    console.log(token);
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: `Internal error ${error}`,
      route: "user/ForgotPasswordToken router",
    });
  }
};

export const ResetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await UserModel.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if(!user){
    return res.status(404).json({
      message: "Token Expired, Please try again later.",
    });
  }
  user.password = password;
  user.passwordResetToken = "";
  user.passwordResetExpires = undefined
};

export const unblockedUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  validateMongoId(id);

  try {
    const unblocked = await UserModel.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    return res.status(200).json({
      message: `This user is unblocked`,
    });
  } catch (error) {
    res.status(500).json({
      message: `Internal error ${error}`,
      route: "user/delete router",
    });
  }
};
