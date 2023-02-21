import express from 'express';
import { CreateUser, Login } from '../controller/userController';
const router = express.Router();

/* GET users listing. */
router.post('/register', CreateUser);
router.post('/login', Login);

export default router;
