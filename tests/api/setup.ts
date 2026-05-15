import { apiClient } from './helpers/api-client';

beforeEach(async () => {
  const response = await apiClient.get('/tasks?limit=100');
  const tasks = response.body.data || [];
  for (const task of tasks) {
    await apiClient.delete(`/tasks/${task.id}`);
  }
});
