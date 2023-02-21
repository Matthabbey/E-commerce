import express, { Request, Response } from "express";
import { UserModel } from "../models/userModel";

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, phone, password, email } = req.body;
    const findUser = await UserModel.findOne({ email: email });
    if (!findUser) {
      const newUser = await UserModel.create({
        firstName,
        lastName,
        phone,
        password,
        email,
      });
      return res.status(201).json({
        messsage: "User successfully created",
        newUser
      });
    }
    return res.status(400).json({
      message: "User already exit",
    });
  } catch (error) {}
};
