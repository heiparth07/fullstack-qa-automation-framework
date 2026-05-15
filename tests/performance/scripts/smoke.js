import { sleep } from 'k6';
import { createTask, getTasks, getTaskById, updateTask, deleteTask, healthCheck } from '../utils/helpers.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
  tags: { testType: 'smoke' },
};

export default function () {
  healthCheck();

  const task = createTask();

  getTasks();

  getTaskById(task.id);

  updateTask(task.id, { title: 'Updated by smoke test', status: 'completed' });

  deleteTask(task.id);

  sleep(1);
}
