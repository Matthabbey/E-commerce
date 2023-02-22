"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const authRoutes_1 = require("../middlewares/authRoutes");
const router = express_1.default.Router();
/* GET users listing. */
router.post("/register", userController_1.CreateUser);
router.post("/login", userController_1.Login);
router.get("/getusers", userController_1.getAllUsers);
router.get("/singleuser/:id", authRoutes_1.authMiddleware, authRoutes_1.isAdmin, userController_1.getSingleUser);
router.put("/update", authRoutes_1.authMiddleware, userController_1.updateUser);
router.delete("/delete/:id", userController_1.deleteUser);
router.put("/block-user/:id", authRoutes_1.authMiddleware, authRoutes_1.isAdmin, userController_1.blockedUser);
router.put("/unblock-user/:id", authRoutes_1.authMiddleware, authRoutes_1.isAdmin, userController_1.unblockedUser);
router.put("/refresh", userController_1.handleRefreshToken);
exports.default = router;
