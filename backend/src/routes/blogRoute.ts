import express from "express";
import {
  CreateBlog,
  DeleteBlog,
  GetAllBlogs,
  GetSingleBlog,
  UpdateBlog,
} from "../controller/blogController";
import { authMiddleware, isAdmin } from "../middlewares/authRoutes";
const router = express.Router();

router.post("/create", authMiddleware, isAdmin, CreateBlog);
router.put("/update/:id", authMiddleware, isAdmin, UpdateBlog);
router.get("/getone/:id", GetSingleBlog);
router.get("/get-all", GetAllBlogs);
router.delete("/delete/:id", authMiddleware, isAdmin, DeleteBlog);

export default router;
