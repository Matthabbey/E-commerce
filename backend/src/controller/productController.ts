import express, { Request, Response } from "express";
import { ProductModel } from "../models/ProductModel";
import slugify from 'slugify'
import { validateMongoId } from "../utilities/utils";



export const CreateProduct = async(req: Request, res: Response)=>{
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await ProductModel.create(req.body)
        return res.status(200).json({product: newProduct})
    } catch (error) {
        res.status(500).json({
            Error: `Internal server ${error}`,
            route: "/product/create"
    })
}
};

export const GetAllProducts = async (req: Request, res: Response) => {
    try {
      //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
      const products = await ProductModel.find();
      return res.status(200).json({
        message: "You have successfully retrieved all products in your database",
        Products: products,
      });
    } catch (error) {
        res.status(500).json({
            Error: `Internal server ${error}`,
            route: "/product/get-all"
    })
    }
  };

  export const GetSingleProduct = async (req: Request, res: Response) => {
    try {
      //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
      const product = await ProductModel.findById(req.params.id);
      return res.status(200).json({
        message: "You have successfully retrieved all product in your database",
        Product: product,
      });
    } catch (error) {
      res.status(500).json({
        Error: `Internal server ${error}`,
        route: "/product/get-single"
      });
    }
  };

  export const UpdateProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
      const update = await ProductModel.findByIdAndUpdate(id, req.body, {new: true});
      return res.status(200).json({
        message: "Successfully updated",
        Updated: update
      });
    } catch (error) {
      res.status(500).json({
        Error: `Internal server ${error}`,
        route: "/product/update-product"
      });
    }
  };
  export const DeleteProduct = async (req: Request, res: Response) => {
    const id = req.params.id;
    validateMongoId(id);
    try {
      const deleteMe = await ProductModel.findByIdAndDelete(id);
  
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
        Error: `Internal server ${error}`,
        route: "/product/delete-product"
      });
    }
  };
