import express, { Request, Response } from "express";
import { ProductModel } from "../models/ProductModel";
import slugify from "slugify";
import { validateMongoId } from "../utilities/utils";
import { UserModel } from "../models/userModel";

export const CreateProduct = async (req: Request, res: Response) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await ProductModel.create(req.body);
    return res.status(200).json({ product: newProduct });
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/product/create",
    });
  }
};

export const GetAllProducts = async (req: Request, res: Response) => {
  try {
    // Filter
    const queryObj = { ...req.query };
    const excludeField = ["page", "sort", "limit", "fields"];
    let m = excludeField.forEach((el) => delete queryObj[el]); //Not in used
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = ProductModel.find(JSON.parse(queryStr));

    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    //Limiting the showing fields
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }
    //Pagination
    const page: any = req.query.page;
    const limit: any = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await ProductModel.countDocuments();
      if (skip >= productCount) {
        return res.status(404).json({ msg: "Sorry, This page does not exits" });
      }
    }

    const products = await query;
    return res.status(200).json({
      message: "You have successfully retrieved all products in your database",
      Products: products,
    });
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/product/get-all",
    });
  }
};

export const AddToWishList = async (req: Request, res: Response) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  validateMongoId(prodId);
  try {
    const user = await UserModel.findById(_id);

    if (prodId && user) {
      const alreadyExist = user?.wishList.includes(prodId.toString());

      if (alreadyExist) {
        let user = await UserModel.findByIdAndUpdate(
          _id,
          {
            $pull: { wishList: prodId },
          },
          {
            new: true,
          }
        );
        return res.json(user);
      } else {
        let user = await UserModel.findByIdAndUpdate(
          _id,
          {
            $push: { wishList: prodId },
          },

          {
            new: true,
          }
        );
        return res.json(user);
      }
    }
    return res
      .status(404)
      .json({ message: "There is no product matches, add a valid product" });
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/wishlist/product",
    });
  }
};

export const Rating = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user;
    const { prodId, star, comment } = req.body;
    const product = await ProductModel.findById(prodId);

    const alreadyRated = product?.ratings.includes(_id.toString());
    if (alreadyRated) {
      const rate = await ProductModel.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "comment": comment },
        },
        {
          new: true,
        }
      );
    } else {
      const rating = await ProductModel.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallrating = await ProductModel.findById(prodId);
    let totalRating = getallrating?.ratings.length;
    let ratingsum = getallrating?.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating!);
    let finalProduct = await ProductModel.findByIdAndUpdate(
      prodId,
      {
        totalratings: actualRating,
      },
      {
        new: true,
      }
    );
    return res.status(200).json(finalProduct);
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/wishlist/product",
    });
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
      route: "/product/get-single",
    });
  }
};

export const UpdateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const update = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({
      message: "Successfully updated",
      Updated: update,
    });
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/product/update-product",
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
      route: "/product/delete-product",
    });
  }
};
