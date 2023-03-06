import express from "express";
import { CreateCoupon, DeleteCoupon, GetAllCoupon, UpdateCoupon } from "../controller/couponController";
import { authMiddleware, isAdmin } from "../middlewares/authRoutes";
const router = express.Router();

router.post("/create", authMiddleware, isAdmin, CreateCoupon);
router.get("/getall", authMiddleware, isAdmin, GetAllCoupon);
router.put("/update/:id", authMiddleware, isAdmin, UpdateCoupon);
router.delete("/delete/:id", authMiddleware, isAdmin, DeleteCoupon);

export default router;
