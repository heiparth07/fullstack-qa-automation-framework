import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { cleanupAllTasks } from '../utils/helpers';
import { testTasks } from '../fixtures/test-data';

test.describe('Task Creation', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page, request }) => {
    await cleanupAllTasks(request);
    homePage = new HomePage(page);
    await homePage.goto();
  });

  test('should create a task with all fields', async () => {
    const { title, description, priority } = testTasks.basic;
    await homePage.createTask(title, description, priority);

    await homePage.assertTaskVisible(title);
    const taskCount = await homePage.getTaskCount();
    expect(taskCount).toBe(1);
  });

  test('should create a task with only title', async () => {
    await homePage.createTask('Quick task');

    await homePage.assertTaskVisible('Quick task');
  });

  test('should create a high priority task', async () => {
    const { title, description, priority } = testTasks.highPriority;
    await homePage.createTask(title, description, priority);

    await homePage.assertTaskVisible(title);
    const taskItem = homePage.getTaskByTitle(title);
    await expect(taskItem.getByTestId('task-priority')).toHaveText('high');
  });

  test('should clear form after successful creation', async () => {
    await homePage.createTask('Temp task', 'Temp desc');

    await expect(homePage.titleInput).toHaveValue('');
    await expect(homePage.descriptionInput).toHaveValue('');
  });

  test('should show error when title is empty', async () => {
    await homePage.submitButton.click();

    await expect(homePage.formError).toBeVisible();
    await expect(homePage.formError).toHaveText('Title is required');
  });

  test('should create multiple tasks', async () => {
    await homePage.createTask('Task 1');
    await homePage.createTask('Task 2');
    await homePage.createTask('Task 3');

    const taskCount = await homePage.getTaskCount();
    expect(taskCount).toBe(3);
  });
});
