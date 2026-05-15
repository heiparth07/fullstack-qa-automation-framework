import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/taskmanager';

const sampleTasks = [
  { title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing', status: 'completed', priority: 'high' },
  { title: 'Write API integration tests', description: 'Cover all CRUD endpoints with supertest', status: 'completed', priority: 'high' },
  { title: 'Implement Playwright E2E tests', description: 'Page Object Model for all user flows', status: 'in_progress', priority: 'high' },
  { title: 'Configure k6 performance tests', description: 'Smoke, load, stress, and spike profiles', status: 'in_progress', priority: 'medium' },
  { title: 'Set up OWASP ZAP scanning', description: 'Baseline and full security scans', status: 'pending', priority: 'medium' },
  { title: 'Add Docker Compose orchestration', description: 'Multi-container setup with health checks', status: 'completed', priority: 'medium' },
  { title: 'Write test strategy documentation', description: 'Document test pyramid and approach', status: 'pending', priority: 'low' },
  { title: 'Implement data-driven test fixtures', description: 'Factory functions for test data generation', status: 'completed', priority: 'medium' },
  { title: 'Add cross-browser testing config', description: 'Chromium, Firefox, and WebKit in Playwright', status: 'pending', priority: 'low' },
  { title: 'Review security headers', description: 'Validate OWASP recommended headers', status: 'pending', priority: 'high' },
];

async function seed() {
  const pool = new Pool({ connectionString: DATABASE_URL });

  try {
    await pool.query('DELETE FROM tasks');

    for (const task of sampleTasks) {
      await pool.query(
        'INSERT INTO tasks (title, description, status, priority) VALUES ($1, $2, $3, $4)',
        [task.title, task.description, task.status, task.priority],
      );
    }

    console.log(`Seeded ${sampleTasks.length} tasks successfully.`);
  } finally {
    await pool.end();
  }
}

seed().catch(console.error);
