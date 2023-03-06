import express, { Request, Response } from "express";
import { CouponModel } from "../models/couponModel";
import { validateMongoId } from "../utilities/utils";

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

export const GetAllCoupon = async (req: Request, res: Response) => {
  try {
    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const coupon = await CouponModel.find();
    return res.status(200).json({
      message:
        "You have successfully retrieved all coupons in your database",
      coupon,
    });
  } catch (err) {
    res.status(500).json({
      Error: `Internal Server ${err}`,
      route: "Blogcategory/get-all-Blogcategory",
    });
  }
};
export const UpdateCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    validateMongoId(id)
    const coupon =  await CouponModel.findByIdAndUpdate(id, req.body, {new: true})
    return res.status(200).json({ message:"Successfully Updated Category", coupon  });

  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/coupon/update",
    });
  }
 }

 export const DeleteCoupon = async (req: Request, res: Response) => {
  const id = req.params.id;
  validateMongoId(id);
  try {
    const deleteMe = await CouponModel.findByIdAndDelete(id);

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
      Error: `Internal Server ${error}`,
      route: "coupon/delete router",
    });
  }
};
