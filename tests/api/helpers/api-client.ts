import supertest from 'supertest';

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

export const apiClient = supertest(BASE_URL + '/api');

export async function createTaskViaApi(data: {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
}) {
  const response = await apiClient
    .post('/tasks')
    .send(data)
    .expect(201);
  return response.body.data;
}

export async function deleteAllTasks() {
  const response = await apiClient.get('/tasks?limit=100');
  const tasks = response.body.data || [];
  for (const task of tasks) {
    await apiClient.delete(`/tasks/${task.id}`);
  }
}
