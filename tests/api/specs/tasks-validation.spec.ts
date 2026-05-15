import { apiClient, deleteAllTasks } from '../helpers/api-client';
import { invalidTask, xssPayloadTask } from '../fixtures/task.fixtures';

describe('Tasks Validation', () => {
  beforeEach(async () => {
    await deleteAllTasks();
  });

  describe('POST /api/tasks - Validation Errors', () => {
    it('should return 400 when title is empty', async () => {
      const response = await apiClient
        .post('/tasks')
        .send(invalidTask())
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'title' }),
        ]),
      );
    });

    it('should return 400 when title is missing', async () => {
      const response = await apiClient
        .post('/tasks')
        .send({ description: 'No title' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 400 for invalid status enum', async () => {
      const response = await apiClient
        .post('/tasks')
        .send({ title: 'Test', status: 'invalid_status' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'status' }),
        ]),
      );
    });

    it('should return 400 for invalid priority enum', async () => {
      const response = await apiClient
        .post('/tasks')
        .send({ title: 'Test', priority: 'urgent' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'priority' }),
        ]),
      );
    });

    it('should return 400 when title exceeds max length', async () => {
      const response = await apiClient
        .post('/tasks')
        .send({ title: 'a'.repeat(256) })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Validation failed');
    });
  });

  describe('PUT /api/tasks/:id - Validation Errors', () => {
    it('should return 400 for invalid status on update', async () => {
      const created = await apiClient
        .post('/tasks')
        .send({ title: 'Test' })
        .expect(201);

      await apiClient
        .put(`/tasks/${created.body.data.id}`)
        .send({ status: 'invalid' })
        .expect(400);
    });
  });

  describe('XSS Prevention', () => {
    it('should store XSS payloads as plain text without execution', async () => {
      const payload = xssPayloadTask();
      const response = await apiClient
        .post('/tasks')
        .send(payload)
        .expect(201);

      expect(response.body.data.title).toBe(payload.title);
      expect(response.body.data.description).toBe(payload.description);
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('Content-Type Handling', () => {
    it('should return JSON for all responses', async () => {
      const response = await apiClient.get('/tasks');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should handle empty body gracefully on POST', async () => {
      await apiClient.post('/tasks').send({}).expect(400);
    });
  });
});
