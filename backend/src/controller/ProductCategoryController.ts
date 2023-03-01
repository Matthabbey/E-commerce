import express, { Request, Response } from "express";
import slugify from "slugify";
import { ProductCategoryModel } from "../models/ProductcategoryModel";
import { validateMongoId } from "../utilities/utils";

export const CreateProductCategory = async (req: Request, res: Response) => {
  try {
    const productCategory = await ProductCategoryModel.create(req.body);
    return res.status(200).json({ cat: productCategory });
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/category/create",
    });
  }
};