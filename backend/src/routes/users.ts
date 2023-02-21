import express from 'express';
import { CreateUser } from '../controller/userController';
const router = express.Router();

/* GET users listing. */
router.post('/register', CreateUser);

export default router;
