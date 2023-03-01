import express, { Request, Response } from "express";
import { BlogModel } from "../models/blogModel";
import { validateMongoId } from "../utilities/utils";

export const CreateBlog = async (req: Request, res: Response) => {
  try {
    const newBlog = await BlogModel.create(req.body);
    return res.status(201).json({
      messsage: "User successfully created",
      newBlog,
    });
  } catch (error) {
    res.status(500).json({
      Error: `Internal Server ${error}`,
      route: "/blog/create",
    });
  }
};

export const UpdateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const update = await BlogModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({
      message: "Successfully updated",
      update,
    });
  } catch (error) {
    res.status(500).json({
      Error: `Internal Server ${error}`,
      route: "blog/update router",
    });
  }
};

export const GetSingleBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    validateMongoId(id);

    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const blog = await BlogModel.findById(id);
    const getview = await BlogModel.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      message: "You have successfully blog in your database",
      Blog: blog,
    });
  } catch (err) {
    res.status(500).json({
      Error: "Internal server Error",
      route: "blog/get-single-blog",
    });
  }
};

export const GetAllBlogs = async (req: Request, res: Response) => {
  try {
    //Request dot Query(req.query) is use to sort, filter or cause a limit of views to what you want to see in the getAll http method.
    const blog = await BlogModel.find();
    return res.status(200).json({
      message: "You have successfully retrieved all blog in your database",
      User: blog,
    });
  } catch (err) {
    res.status(500).json({
      Error: `Internal Server ${err}`,
      route: "blog/get-all-blog",
    });
  }
};

export const DeleteBlog = async (req: Request, res: Response) => {
  const id = req.params.id;
  validateMongoId(id);
  try {
    const deleteMe = await BlogModel.findByIdAndDelete(id);

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
      route: "/blog/delete-blog",
    });
  }
};

export const likedBlog = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.body;
    // validateMongoId(blogId);
    console.log(blogId);

    //   //Find blog you want to like by Id
    const blog = await BlogModel.findById(blogId);
    //   //Find the login user
    // console.log(blog);

    const loginUserId = req?.user?._id;
    console.log("jjjjj",loginUserId.toString());

    //   //Find if the user has been liked
    const isLiked = blog?.isLiked;
    // console.log(isLiked);

    // //Find if the user has been disliked
    console.log(blog?.dislikes);
    

    const alreadyDisliked = blog?.dislikes?.find((userId) => userId.toString() === loginUserId.toString())

    console.log(alreadyDisliked);

    if (alreadyDisliked) {
      console.log("here now");
      const blogPost = await BlogModel.findByIdAndUpdate(
        blogId,
        {
          $pull: { dislikes: loginUserId },
          isDisliked: false,
        },
        {
          new: true,
        }
      );
      return res.status(200).json(blogPost);
    }
    if (!isLiked) {
      const blog = await BlogModel.findByIdAndUpdate(
        blogId,
        {
          $push: { likes: loginUserId },
          isLiked: true,
        },
        {
          new: true,
        }
      );
      return res.status(200).json(blog);
    }
  } catch (error) {
    res.status(500).json({
      Error: `Internal server ${error}`,
      route: "/blog/likes-blog",
    });
  }
};
