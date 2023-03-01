import express from 'express';
import { CreateCategory } from '../controller/categoryController';
import { authMiddleware, isAdmin } from '../middlewares/authRoutes';
const router = express.Router();

router.post('/create', authMiddleware, isAdmin, CreateCategory)

export default router;
