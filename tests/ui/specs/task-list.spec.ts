import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { cleanupAllTasks, seedTaskViaApi } from '../utils/helpers';

test.describe('Task List & Filtering', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page, request }) => {
    await cleanupAllTasks(request);
    homePage = new HomePage(page);
  });

  test('should show empty state when no tasks exist', async () => {
    await homePage.goto();

    await expect(homePage.emptyState).toBeVisible();
    await expect(homePage.emptyState).toHaveText('No tasks found. Create one above!');
  });

  test('should display all seeded tasks', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'Task A' });
    await seedTaskViaApi(request, { title: 'Task B' });
    await seedTaskViaApi(request, { title: 'Task C' });
    await homePage.goto();

    const count = await homePage.getTaskCount();
    expect(count).toBe(3);
  });

  test('should filter tasks by status', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'Pending Task', status: 'pending' });
    await seedTaskViaApi(request, { title: 'Completed Task', status: 'completed' });
    await homePage.goto();

    await homePage.filterByStatus('pending');

    await homePage.assertTaskVisible('Pending Task');
    await homePage.assertTaskNotVisible('Completed Task');
  });

  test('should filter tasks by priority', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'High Task', priority: 'high' });
    await seedTaskViaApi(request, { title: 'Low Task', priority: 'low' });
    await homePage.goto();

    await homePage.filterByPriority('high');

    await homePage.assertTaskVisible('High Task');
    await homePage.assertTaskNotVisible('Low Task');
  });

  test('should reset filters to show all tasks', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'Pending Task', status: 'pending' });
    await seedTaskViaApi(request, { title: 'Completed Task', status: 'completed' });
    await homePage.goto();

    await homePage.filterByStatus('pending');
    await homePage.expectTaskCount(1);

    await homePage.filterByStatus('');
    await homePage.expectTaskCount(2);
  });

  test('should navigate to task detail on title click', async ({ page, request }) => {
    const task = await seedTaskViaApi(request, { title: 'Navigate Test' });
    await homePage.goto();

    await homePage.clickTaskTitle('Navigate Test');

    await page.waitForURL(`/tasks/${task.id}`);
    await expect(page.getByTestId('detail-title')).toHaveText('Navigate Test');
  });

  test('should show pagination for many tasks', async ({ request }) => {
    for (let i = 1; i <= 15; i++) {
      await seedTaskViaApi(request, { title: `Paginated Task ${i}` });
    }
    await homePage.goto();

    await expect(homePage.page.getByTestId('pagination')).toBeVisible();
    await expect(homePage.page.getByTestId('page-info')).toContainText('Page 1');

    const count = await homePage.getTaskCount();
    expect(count).toBe(10);
  });
});
