import express, { Request, Response } from "express";
import { BrandModel } from "../models/brandModel";
import { validateMongoId } from "../utilities/utils";

export const CreateBrand = async (req: Request, res: Response) => {
  try {
    const findbrand = await BrandModel.findOne(req.body, req.user?._id)
    if(!findbrand){
      const brand = await BrandModel.create(req.body);
      return res.status(200).json({message: "Successfully Created Blog Category",cat: brand });
    }
    return res.status(400).json({
      message: "Category already exit from user"
    });

  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/category/create",
    });
  }
};
 export const UpdateBrand = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    validateMongoId(id)
    const brand =  await BrandModel.findByIdAndUpdate(id, req.body, {new: true})
    return res.status(200).json({ message:"Successfully Updated Category", update: brand });

  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/category/create",
    });
  }
 }

 export const DeleteBrand = async (req: Request, res: Response) => {
  const id = req.params.id;
  validateMongoId(id);
  try {
    const deleteMe = await BrandModel.findByIdAndDelete(id);

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
      route: "user/delete router",
    });
  }
};

export const GetSingleBrand = async (req: Request, res: Response) => {
  try {
    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const brand = await BrandModel.findById(req.params.id);
    return res.status(200).json({
      message: "You have successfully retrieved all brand in your database",
      Blog: brand,
    });
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/Brand/get-single",
    });
  }
};

export const GetAllBrand = async (req: Request, res: Response) => {
  try {
    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const brand = await BrandModel.find();
    return res.status(200).json({
      message: "You have successfully retrieved all Blogcategory in your database",
      brand: brand,
    });
  } catch (err) {
    res.status(500).json({
      Error: `Internal Server ${err}`,
      route: "Blogcategory/get-all-Blogcategory",
    });
  }
};