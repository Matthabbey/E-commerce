import express from 'express';
import { CreateBrand, DeleteBrand, GetAllBrand, GetSingleBrand, UpdateBrand } from '../controller/brandController';
import { authMiddleware, isAdmin } from '../middlewares/authRoutes';
const router = express.Router();

router.post('/create', authMiddleware, isAdmin, CreateBrand)
router.put('/update/:id', authMiddleware, isAdmin, UpdateBrand)
router.delete('/delete/:id', authMiddleware, isAdmin, DeleteBrand)
router.get('/getsingle/:id', GetSingleBrand)
router.get('/getall', GetAllBrand)


export default router;
