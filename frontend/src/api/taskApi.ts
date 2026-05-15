import axios from 'axios';
import { Task, CreateTaskInput, UpdateTaskInput, PaginatedResponse } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const taskApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }): Promise<PaginatedResponse<Task>> => {
    const { data } = await api.get('/tasks', { params });
    return data;
  },

  getById: async (id: number): Promise<Task> => {
    const { data } = await api.get(`/tasks/${id}`);
    return data.data;
  },

  create: async (input: CreateTaskInput): Promise<Task> => {
    const { data } = await api.post('/tasks', input);
    return data.data;
  },

  update: async (id: number, input: UpdateTaskInput): Promise<Task> => {
    const { data } = await api.put(`/tasks/${id}`, input);
    return data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
