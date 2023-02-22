import express from 'express';
import { CreateUser, deleteUser, getAllUsers, getSingleUser, Login, updateUser } from '../controller/userController';
import { authMiddleware, isAdmin} from '../middlewares/authRoutes';
const router = express.Router();

/* GET users listing. */
router.post('/register', CreateUser);
router.post('/login', Login);
router.get('/getusers', getAllUsers)
router.get('/singleuser/:id', authMiddleware, isAdmin, getSingleUser)
router.put('/update', updateUser)
router.delete('/delete/:id', deleteUser)

export default router;
