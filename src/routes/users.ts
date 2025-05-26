import { Router } from 'express';
import usersController from '../controllers/users.ts';

const router = Router();

router.post('/register', usersController.register);
router.post('/login', usersController.login);

router.get('/', usersController.getAll);

export default router;
