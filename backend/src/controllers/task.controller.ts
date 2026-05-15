import { Request, Response, NextFunction } from 'express';
import { TaskService, TaskNotFoundError } from '../services/task.service';

export const TaskController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
      const status = req.query.status as string | undefined;
      const priority = req.query.priority as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' | undefined;

      const result = await TaskService.getAll({ page, limit, status, priority, sortBy, sortOrder });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }
      const task = await TaskService.getById(id);
      res.json({ data: task });
    } catch (error) {
      if (error instanceof TaskNotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.create(req.body);
      res.status(201).json({ data: task });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }
      const task = await TaskService.update(id, req.body);
      res.json({ data: task });
    } catch (error) {
      if (error instanceof TaskNotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid task ID' });
        return;
      }
      await TaskService.delete(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof TaskNotFoundError) {
        res.status(404).json({ error: error.message });
        return;
      }
      next(error);
    }
  },
};
