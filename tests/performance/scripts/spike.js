import { sleep } from 'k6';
import { createTask, getTasks, deleteTask, healthCheck } from '../utils/helpers.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '10s', target: 150 },
    { duration: '1m', target: 150 },
    { duration: '10s', target: 10 },
    { duration: '2m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],
    http_req_failed: ['rate<0.10'],
  },
  tags: { testType: 'spike' },
};

export default function () {
  healthCheck();

  const task = createTask();
  getTasks();
  deleteTask(task.id);

  sleep(1);
}
