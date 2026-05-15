import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskInput, UpdateTaskInput, PaginatedResponse } from '../types';
import { taskApi } from '../api/taskApi';

interface UseTasksOptions {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
}

export function useTasks(options: UseTasksOptions = {}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Task>['pagination'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskApi.getAll(options);
      setTasks(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [options.page, options.limit, options.status, options.priority]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (input: CreateTaskInput) => {
    const task = await taskApi.create(input);
    await fetchTasks();
    return task;
  };

  const updateTask = async (id: number, input: UpdateTaskInput) => {
    const task = await taskApi.update(id, input);
    await fetchTasks();
    return task;
  };

  const deleteTask = async (id: number) => {
    await taskApi.delete(id);
    await fetchTasks();
  };

  return { tasks, pagination, loading, error, createTask, updateTask, deleteTask, refetch: fetchTasks };
}
