import express, { Request, Response } from "express";
import slugify from "slugify";
import { ProductCategoryModel } from "../models/ProductcategoryModel";
import { validateMongoId } from "../utilities/utils";

export const CreateProductCategory = async (req: Request, res: Response) => {
  try {
    const productCategory = await ProductCategoryModel.create(req.body);
    return res.status(200).json({message: "Successfully Created Product Category",cat: productCategory });
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/category/create",
    });
  }
};
 export const UpdateProductCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    validateMongoId(id)
    const updateCategory =  await ProductCategoryModel.findByIdAndUpdate(id, req.body, {new: true})
    return res.status(200).json({ message:"Successfully Updated Category", update: updateCategory });

  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/category/create",
    });
  }
 }

 export const DeleteProductCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  validateMongoId(id);
  try {
    const deleteMe = await ProductCategoryModel.findByIdAndDelete(id);

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

export const GetSingleProductCategory = async (req: Request, res: Response) => {
  try {
    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const productcategory = await ProductCategoryModel.findById(req.params.id);
    return res.status(200).json({
      message: "You have successfully retrieved all productcategory in your database",
      Product: productcategory,
    });
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/productcategory/get-single",
    });
  }
};

export const GetAllProductCategory = async (req: Request, res: Response) => {
  try {
    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const productcategory = await ProductCategoryModel.find();
    return res.status(200).json({
      message: "You have successfully retrieved all productcategory in your database",
      product: productcategory,
    });
  } catch (err) {
    res.status(500).json({
      Error: `Internal Server ${err}`,
      route: "productcategory/get-all-productcategory",
    });
  }
};