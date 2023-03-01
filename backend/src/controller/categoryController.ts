import express, { Request, Response } from "express";
import slugify from "slugify";
import { CategoryModel } from "../models/categoryModel";
import { validateMongoId } from "../utilities/utils";

export const CreateCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = await CategoryModel.create(req.body);
    return res.status(200).json({ cat: newCategory });
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/category/create",
    });
  }
};