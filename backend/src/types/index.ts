import { z } from 'zod';

export const TaskStatus = z.enum(['pending', 'in_progress', 'completed']);
export const TaskPriority = z.enum(['low', 'medium', 'high']);

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: z.infer<typeof TaskStatus>;
  priority: z.infer<typeof TaskPriority>;
  created_at: Date;
  updated_at: Date;
}

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  status: TaskStatus.default('pending'),
  priority: TaskPriority.default('medium'),
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;

export interface PaginationParams {
  page: number;
  limit: number;
  status?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
