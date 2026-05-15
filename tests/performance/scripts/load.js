import { sleep } from 'k6';
import { createTask, getTasks, updateTask, deleteTask } from '../utils/helpers.js';

export const options = {
  stages: [
    { duration: '2m', target: 20 },
    { duration: '5m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 20 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
  },
  tags: { testType: 'load' },
};

export default function () {
  const task = createTask();

  getTasks(1, 10);
  getTasks(1, 25);

  updateTask(task.id, { status: 'in_progress' });
  updateTask(task.id, { status: 'completed', priority: 'high' });

  deleteTask(task.id);

  sleep(Math.random() * 3 + 1);
}
