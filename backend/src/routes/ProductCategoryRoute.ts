import express from 'express';
import { CreateProductCategory, DeleteProductCategory, UpdateProductCategory, GetAllProductCategory, GetSingleProductCategory } from '../controller/ProductCategoryController';
import { authMiddleware, isAdmin } from '../middlewares/authRoutes';
const router = express.Router();

router.post('/create', authMiddleware, isAdmin, CreateProductCategory)
router.put('/update/:id', authMiddleware, isAdmin, UpdateProductCategory)
router.delete('/delete/:id', authMiddleware, isAdmin, DeleteProductCategory)
router.get('/getsingle/:id', GetSingleProductCategory)
router.get('/getall', GetAllProductCategory)


export default router;
