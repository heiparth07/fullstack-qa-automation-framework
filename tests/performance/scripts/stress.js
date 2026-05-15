import { sleep } from 'k6';
import { createTask, getTasks, updateTask, deleteTask, healthCheck } from '../utils/helpers.js';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '2m', target: 150 },
    { duration: '2m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
  tags: { testType: 'stress' },
};

export default function () {
  healthCheck();

  const task = createTask();
  getTasks();
  updateTask(task.id, { status: 'completed' });
  deleteTask(task.id);

  sleep(0.5);
}
