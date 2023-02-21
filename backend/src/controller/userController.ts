import express, { Request, Response } from "express";
import { UserModel } from "../models/userModel";
import bcrypt from "bcrypt";
import {
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
} from "../utilities/utils";

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
      const signature = await GenerateSignature({
        _id: User?._id,
        email: User?.email,
      });
      // const validation = await bcrypt.compare(password, User?.password)
      return res.status(200).json({
        message: "You have successfully logged in",
        email: User?.email,
        signature
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

export const getAllUsers = async (req: Request, res: Response) => {
    try {
      //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
      const users = await UserModel.find();
      return res.status(200).json({
        message: "You have successfully retrieved all users in your database",
        User: users
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
        User: users
      });
    } catch (err) {
      res.status(500).json({
        Error: "Internal server Error",
        route: "users/get-all-users",
      });
    }
  };


export const updateUser = async (req: Request, res: Response) => {
    try {
      const update = await UserModel.findByIdAndUpdate(req.params.id, req.body);
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
    try {
      const deleteMe = await UserModel.findByIdAndDelete(req.params.id);
      if (!deleteMe) {
        return res.status(404).json({
          message: "This item has been deleted",
        });
      }
      return res.status(200).json({
        message: "You have successfully deleted your TODO item",
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error",
        route: "todo/delete router",
      });
    }
  };


