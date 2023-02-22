import express from "express";
import {
  CreateUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  blockedUser,
  Login,
  updateUser,
  unblockedUser,
  handleRefreshToken,
} from "../controller/userController";
import { authMiddleware, isAdmin } from "../middlewares/authRoutes";
const router = express.Router();

/* GET users listing. */
router.post("/register", CreateUser);
router.post("/login", Login);
router.get("/getusers", getAllUsers);
router.get("/singleuser/:id", authMiddleware, isAdmin, getSingleUser);
router.put("/update", authMiddleware, updateUser);
router.delete("/delete/:id", deleteUser);
router.put("/block-user/:id", authMiddleware, isAdmin, blockedUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockedUser);
router.put("/refresh", handleRefreshToken);

export default router;
