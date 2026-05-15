import { APIRequestContext } from '@playwright/test';

const API_URL = process.env.API_BASE_URL || 'http://localhost:3001';

export async function seedTaskViaApi(
  request: APIRequestContext,
  data: { title: string; description?: string; status?: string; priority?: string },
) {
  const response = await request.post(`${API_URL}/api/tasks`, { data });
  return response.json().then((r) => r.data);
}

export async function cleanupAllTasks(request: APIRequestContext) {
  const response = await request.get(`${API_URL}/api/tasks?limit=100`);
  const body = await response.json();
  const tasks = body.data || [];
  for (const task of tasks) {
    await request.delete(`${API_URL}/api/tasks/${task.id}`);
  }
}

export async function waitForApi(request: APIRequestContext, retries = 10): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await request.get(`${API_URL}/api/health`);
      if (response.ok()) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error('API did not become healthy');
}
