import express from 'express';
import { CreateCoupon } from '../controller/couponController';
import { authMiddleware, isAdmin } from '../middlewares/authRoutes';
const router = express.Router();

router.post('/create', authMiddleware, isAdmin, CreateCoupon)

export default router;
