import { apiClient, createTaskViaApi, deleteAllTasks } from '../helpers/api-client';
import { validTask, bulkTasks } from '../fixtures/task.fixtures';

describe('Tasks CRUD API', () => {
  beforeEach(async () => {
    await deleteAllTasks();
  });

  describe('POST /api/tasks', () => {
    it('should create a task with all fields', async () => {
      const taskData = validTask();
      const response = await apiClient.post('/tasks').send(taskData).expect(201);

      expect(response.body.data).toMatchObject({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
      });
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('created_at');
      expect(response.body.data).toHaveProperty('updated_at');
    });

    it('should create a task with only required fields', async () => {
      const response = await apiClient
        .post('/tasks')
        .send({ title: 'Minimal Task' })
        .expect(201);

      expect(response.body.data.title).toBe('Minimal Task');
      expect(response.body.data.status).toBe('pending');
      expect(response.body.data.priority).toBe('medium');
    });

    it('should create a task with specific status and priority', async () => {
      const taskData = validTask({ status: 'in_progress', priority: 'high' });
      const response = await apiClient.post('/tasks').send(taskData).expect(201);

      expect(response.body.data.status).toBe('in_progress');
      expect(response.body.data.priority).toBe('high');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return empty list when no tasks exist', async () => {
      const response = await apiClient.get('/tasks').expect(200);

      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });

    it('should return all created tasks', async () => {
      await createTaskViaApi(validTask({ title: 'Task 1' }));
      await createTaskViaApi(validTask({ title: 'Task 2' }));

      const response = await apiClient.get('/tasks').expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.total).toBe(2);
    });

    it('should support pagination', async () => {
      const tasks = bulkTasks(15);
      for (const task of tasks) {
        await createTaskViaApi(task);
      }

      const page1 = await apiClient.get('/tasks?page=1&limit=5').expect(200);
      expect(page1.body.data).toHaveLength(5);
      expect(page1.body.pagination).toMatchObject({
        page: 1,
        limit: 5,
        total: 15,
        totalPages: 3,
      });

      const page2 = await apiClient.get('/tasks?page=2&limit=5').expect(200);
      expect(page2.body.data).toHaveLength(5);

      const page1Ids = page1.body.data.map((t: { id: number }) => t.id);
      const page2Ids = page2.body.data.map((t: { id: number }) => t.id);
      expect(page1Ids).not.toEqual(expect.arrayContaining(page2Ids));
    });

    it('should filter by status', async () => {
      await createTaskViaApi(validTask({ title: 'Pending', status: 'pending' }));
      await createTaskViaApi(validTask({ title: 'Done', status: 'completed' }));

      const response = await apiClient.get('/tasks?status=pending').expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Pending');
    });

    it('should filter by priority', async () => {
      await createTaskViaApi(validTask({ title: 'High', priority: 'high' }));
      await createTaskViaApi(validTask({ title: 'Low', priority: 'low' }));

      const response = await apiClient.get('/tasks?priority=high').expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('High');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a single task by id', async () => {
      const created = await createTaskViaApi(validTask());

      const response = await apiClient.get(`/tasks/${created.id}`).expect(200);

      expect(response.body.data).toMatchObject({
        id: created.id,
        title: created.title,
      });
    });

    it('should return 404 for non-existent task', async () => {
      await apiClient.get('/tasks/99999').expect(404);
    });

    it('should return 400 for invalid id', async () => {
      await apiClient.get('/tasks/abc').expect(400);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task title', async () => {
      const created = await createTaskViaApi(validTask());

      const response = await apiClient
        .put(`/tasks/${created.id}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.id).toBe(created.id);
    });

    it('should update task status', async () => {
      const created = await createTaskViaApi(validTask());

      const response = await apiClient
        .put(`/tasks/${created.id}`)
        .send({ status: 'completed' })
        .expect(200);

      expect(response.body.data.status).toBe('completed');
    });

    it('should update multiple fields at once', async () => {
      const created = await createTaskViaApi(validTask());

      const updates = {
        title: 'Multi Update',
        description: 'New description',
        status: 'in_progress' as const,
        priority: 'high' as const,
      };

      const response = await apiClient
        .put(`/tasks/${created.id}`)
        .send(updates)
        .expect(200);

      expect(response.body.data).toMatchObject(updates);
    });

    it('should update updated_at timestamp', async () => {
      const created = await createTaskViaApi(validTask());
      const originalUpdatedAt = new Date(created.updated_at).getTime();

      await new Promise((r) => setTimeout(r, 50));

      const response = await apiClient
        .put(`/tasks/${created.id}`)
        .send({ title: 'Timestamp Check' })
        .expect(200);

      const newUpdatedAt = new Date(response.body.data.updated_at).getTime();
      expect(newUpdatedAt).toBeGreaterThan(originalUpdatedAt);
    });

    it('should return 404 for non-existent task', async () => {
      await apiClient.put('/tasks/99999').send({ title: 'Nope' }).expect(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const created = await createTaskViaApi(validTask());

      await apiClient.delete(`/tasks/${created.id}`).expect(204);
      await apiClient.get(`/tasks/${created.id}`).expect(404);
    });

    it('should return 404 for non-existent task', async () => {
      await apiClient.delete('/tasks/99999').expect(404);
    });

    it('should not affect other tasks when deleting', async () => {
      const task1 = await createTaskViaApi(validTask({ title: 'Keep' }));
      const task2 = await createTaskViaApi(validTask({ title: 'Delete' }));

      await apiClient.delete(`/tasks/${task2.id}`).expect(204);

      const response = await apiClient.get('/tasks').expect(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].id).toBe(task1.id);
    });
  });

  describe('Full CRUD Lifecycle', () => {
    it('should handle create -> read -> update -> delete flow', async () => {
      const created = await createTaskViaApi(validTask({ title: 'Lifecycle Test' }));
      expect(created.title).toBe('Lifecycle Test');

      const read = await apiClient.get(`/tasks/${created.id}`).expect(200);
      expect(read.body.data.title).toBe('Lifecycle Test');

      const updated = await apiClient
        .put(`/tasks/${created.id}`)
        .send({ title: 'Updated Lifecycle', status: 'completed' })
        .expect(200);
      expect(updated.body.data.title).toBe('Updated Lifecycle');
      expect(updated.body.data.status).toBe('completed');

      await apiClient.delete(`/tasks/${created.id}`).expect(204);
      await apiClient.get(`/tasks/${created.id}`).expect(404);
    });
  });
});
