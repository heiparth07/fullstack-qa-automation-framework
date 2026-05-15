import { TaskModel } from '../models/task.model';
import { CreateTaskDTO, UpdateTaskDTO, PaginatedResponse, PaginationParams, Task } from '../types';

export class TaskNotFoundError extends Error {
  constructor(id: number) {
    super(`Task with id ${id} not found`);
    this.name = 'TaskNotFoundError';
  }
}

export const TaskService = {
  async getAll(params: PaginationParams): Promise<PaginatedResponse<Task>> {
    const { rows, total } = await TaskModel.findAll(params);
    return {
      data: rows,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  },

  async getById(id: number): Promise<Task> {
    const task = await TaskModel.findById(id);
    if (!task) throw new TaskNotFoundError(id);
    return task;
  },

  async create(data: CreateTaskDTO): Promise<Task> {
    return TaskModel.create(data);
  },

  async update(id: number, data: UpdateTaskDTO): Promise<Task> {
    const task = await TaskModel.update(id, data);
    if (!task) throw new TaskNotFoundError(id);
    return task;
  },

  async delete(id: number): Promise<void> {
    const deleted = await TaskModel.delete(id);
    if (!deleted) throw new TaskNotFoundError(id);
  },
};
