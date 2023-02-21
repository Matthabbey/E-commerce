import express from 'express';
import { CreateUser, deleteUser, getAllUsers, getSingleUser, Login, updateUser } from '../controller/userController';
const router = express.Router();

/* GET users listing. */
router.post('/register', CreateUser);
router.post('/login', Login);
router.get('/getusers', getAllUsers)
router.get('/singleuser', getSingleUser)
router.put('/update', updateUser)
router.delete('/delete', deleteUser)

export default router;
