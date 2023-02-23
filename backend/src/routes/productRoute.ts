import express from 'express';
import { CreateProduct, DeleteProduct, GetAllProducts, GetSingleProduct, UpdateProduct } from '../controller/productController';
import { authMiddleware, isAdmin } from '../middlewares/authRoutes';
const router = express.Router();

/* GET home page. */
router.post('/create',authMiddleware, isAdmin,  CreateProduct);
router.get('/get-products', GetAllProducts)
router.get('/single-product/:id', authMiddleware, isAdmin, GetSingleProduct)
router.put('/update/:id',authMiddleware, isAdmin, UpdateProduct)
router.delete('/delete/:id', authMiddleware, isAdmin, DeleteProduct)

export default router;
