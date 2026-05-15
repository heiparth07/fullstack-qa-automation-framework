import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validate } from '../middleware/validate';
import { CreateTaskSchema, UpdateTaskSchema } from '../types';

const router = Router();

router.get('/', TaskController.getAll);
router.get('/:id', TaskController.getById);
router.post('/', validate(CreateTaskSchema), TaskController.create);
router.put('/:id', validate(UpdateTaskSchema), TaskController.update);
router.delete('/:id', TaskController.delete);

export default router;
