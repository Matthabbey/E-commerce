import express, { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import bcrypt from "bcrypt";
import { GeneratePassword, GenerateSalt } from "../utilities/utils";

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, password, email } = req.body;

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

    const validation = await bcrypt.compare(password, User.password);
    if (validation) {
      // const validation = await bcrypt.compare(password, User?.password)
      return res.status(200).json({
        message: "You have successfully logged in",
        email: User?.email,
        firstName: User?.firstName,
        lastName: User?.lastName,
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

function GenerateSignature(arg0: { id: any; email: string }) {
  throw new Error("Function not implemented.");
}
