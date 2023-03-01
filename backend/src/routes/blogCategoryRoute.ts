import express from 'express';
import { CreateBlogCategory, DeleteBlogCategory, UpdateBlogCategory, GetAllBlogCategory, GetSingleBlogCategory } from '../controller/blogCategoryController';
import { authMiddleware, isAdmin } from '../middlewares/authRoutes';
const router = express.Router();

router.post('/create', authMiddleware, isAdmin, CreateBlogCategory)
router.put('/update/:id', authMiddleware, isAdmin, UpdateBlogCategory)
router.delete('/delete/:id', authMiddleware, isAdmin, DeleteBlogCategory)
router.get('/getsingle/:id', GetSingleBlogCategory)
router.get('/getall', GetAllBlogCategory)


export default router;
