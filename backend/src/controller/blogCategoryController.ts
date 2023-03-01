import express, { Request, Response } from "express";
import { BlogCategoryModel } from "../models/blogCategoryModel";
import { validateMongoId } from "../utilities/utils";

export const CreateBlogCategory = async (req: Request, res: Response) => {
  try {
    const findCategory = await BlogCategoryModel.findOne(req.body, req.user?._id)
    if(!findCategory){
      const BlogCategory = await BlogCategoryModel.create(req.body);
      return res.status(200).json({message: "Successfully Created Blog Category",cat: BlogCategory });
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
 export const UpdateBlogCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    validateMongoId(id)
    const updateCategory =  await BlogCategoryModel.findByIdAndUpdate(id, req.body, {new: true})
    return res.status(200).json({ message:"Successfully Updated Category", update: updateCategory });

  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/category/create",
    });
  }
 }

 export const DeleteBlogCategory = async (req: Request, res: Response) => {
  const id = req.params.id;
  validateMongoId(id);
  try {
    const deleteMe = await BlogCategoryModel.findByIdAndDelete(id);

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

export const GetSingleBlogCategory = async (req: Request, res: Response) => {
  try {
    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const Blogcategory = await BlogCategoryModel.findById(req.params.id);
    return res.status(200).json({
      message: "You have successfully retrieved all Blogcategory in your database",
      Blog: Blogcategory,
    });
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/Blogcategory/get-single",
    });
  }
};

export const GetAllBlogCategory = async (req: Request, res: Response) => {
  try {
    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const Blogcategory = await BlogCategoryModel.find();
    return res.status(200).json({
      message: "You have successfully retrieved all Blogcategory in your database",
      Blog: Blogcategory,
    });
  } catch (err) {
    res.status(500).json({
      Error: `Internal Server ${err}`,
      route: "Blogcategory/get-all-Blogcategory",
    });
  }
};