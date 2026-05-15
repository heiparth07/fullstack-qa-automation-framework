import { check } from 'k6';
import http from 'k6/http';

const BASE_URL = __ENV.API_BASE_URL || 'http://localhost:3001';

export function randomTask() {
  return JSON.stringify({
    title: `k6 Task ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    description: 'Performance test task',
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
  });
}

export function createTask() {
  const payload = randomTask();
  const response = http.post(`${BASE_URL}/api/tasks`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    'create: status 201': (r) => r.status === 201,
    'create: has id': (r) => JSON.parse(r.body).data.id !== undefined,
  });

  return JSON.parse(response.body).data;
}

export function getTasks(page = 1, limit = 10) {
  const response = http.get(`${BASE_URL}/api/tasks?page=${page}&limit=${limit}`);

  check(response, {
    'list: status 200': (r) => r.status === 200,
    'list: has data array': (r) => Array.isArray(JSON.parse(r.body).data),
  });

  return JSON.parse(response.body);
}

export function getTaskById(id) {
  const response = http.get(`${BASE_URL}/api/tasks/${id}`);

  check(response, {
    'get: status 200': (r) => r.status === 200,
  });

  return JSON.parse(response.body).data;
}

export function updateTask(id, updates) {
  const response = http.put(`${BASE_URL}/api/tasks/${id}`, JSON.stringify(updates), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    'update: status 200': (r) => r.status === 200,
  });

  return JSON.parse(response.body).data;
}

export function deleteTask(id) {
  const response = http.del(`${BASE_URL}/api/tasks/${id}`);

  check(response, {
    'delete: status 204': (r) => r.status === 204,
  });
}

export function healthCheck() {
  const response = http.get(`${BASE_URL}/api/health`);

  check(response, {
    'health: status 200': (r) => r.status === 200,
    'health: is healthy': (r) => JSON.parse(r.body).status === 'healthy',
  });
}
