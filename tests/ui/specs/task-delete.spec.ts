import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { TaskDetailPage } from '../pages/TaskDetailPage';
import { cleanupAllTasks, seedTaskViaApi } from '../utils/helpers';

test.describe('Task Deletion', () => {
  let homePage: HomePage;
  let detailPage: TaskDetailPage;

  test.beforeEach(async ({ page, request }) => {
    await cleanupAllTasks(request);
    homePage = new HomePage(page);
    detailPage = new TaskDetailPage(page);
  });

  test('should delete task from list view', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'Delete From List' });
    await homePage.goto();

    await homePage.assertTaskVisible('Delete From List');
    await homePage.deleteTaskByTitle('Delete From List');

    await homePage.assertTaskNotVisible('Delete From List');
    await expect(homePage.emptyState).toBeVisible();
  });

  test('should delete task from detail view', async ({ page, request }) => {
    await seedTaskViaApi(request, { title: 'Delete From Detail' });
    await homePage.goto();
    await homePage.clickTaskTitle('Delete From Detail');
    await detailPage.waitForReady();

    await detailPage.deleteTask();

    await page.waitForURL('/');
    await homePage.waitForReady();
    await homePage.assertTaskNotVisible('Delete From Detail');
  });

  test('should not affect other tasks when deleting', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'Keep This' });
    await seedTaskViaApi(request, { title: 'Delete This' });
    await homePage.goto();

    await homePage.deleteTaskByTitle('Delete This');

    await homePage.assertTaskVisible('Keep This');
    await homePage.assertTaskNotVisible('Delete This');
    const count = await homePage.getTaskCount();
    expect(count).toBe(1);
  });

  test('should show empty state after deleting last task', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'Last Task' });
    await homePage.goto();

    await homePage.deleteTaskByTitle('Last Task');

    await expect(homePage.emptyState).toBeVisible();
  });
});
