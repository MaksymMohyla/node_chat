import { Router } from 'express';
import roomController from '../controllers/rooms.ts';

const router = Router();

router.post('/create', roomController.create);
router.post('/:id/addUser', roomController.addUserToRoom);
router.patch('/:id/removeUser', roomController.removeUserFromRoom);

router.post('/:id/addMessage', roomController.addMessageToRoom);

router.get('/', roomController.getAll);
router.get('/:id', roomController.getById);

export default router;
