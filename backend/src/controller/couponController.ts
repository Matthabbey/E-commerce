import express, { Request, Response } from "express";
import { CouponModel } from "../models/couponModel";


export const CreateCoupon = async (req: Request, res: Response) => {
    try {
      const coupon = await CouponModel.create(req.body);
      return res.status(201).json({
        messsage: "User successfully created",
        coupon,
      });
    } catch (error) {
      res.status(500).json({
        Error: `Internal Server ${error}`,
        route: "/blog/create",
      });
    }
  };