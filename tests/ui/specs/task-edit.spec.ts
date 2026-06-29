import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { TaskDetailPage } from '../pages/TaskDetailPage';
import { cleanupAllTasks, seedTaskViaApi } from '../utils/helpers';
import { editData } from '../fixtures/test-data';

test.describe('Task Editing', () => {
  let homePage: HomePage;
  let detailPage: TaskDetailPage;

  test.beforeEach(async ({ page, request }) => {
    await cleanupAllTasks(request);
    homePage = new HomePage(page);
    detailPage = new TaskDetailPage(page);
  });

  test('should edit task title from detail page', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'Original Title' });
    await homePage.goto();
    await homePage.clickTaskTitle('Original Title');
    await detailPage.waitForReady();

    await detailPage.editTitle(editData.updatedTitle);

    await detailPage.assertTitle(editData.updatedTitle);
  });

  test('should edit task description', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'Edit Desc Test', description: 'Old desc' });
    await homePage.goto();
    await homePage.clickTaskTitle('Edit Desc Test');
    await detailPage.waitForReady();

    await detailPage.editDescription(editData.updatedDescription);

    await detailPage.assertDescription(editData.updatedDescription);
  });

  test('should change task status', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'Status Change Test' });
    await homePage.goto();
    await homePage.clickTaskTitle('Status Change Test');
    await detailPage.waitForReady();

    await detailPage.changeStatus('completed');

    await detailPage.assertStatus('completed');
  });

  test('should cancel edit without saving', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'Cancel Test' });
    await homePage.goto();
    await homePage.clickTaskTitle('Cancel Test');
    await detailPage.waitForReady();

    await detailPage.editButton.click();
    await detailPage.editTitleInput.clear();
    await detailPage.editTitleInput.fill('Should Not Save');
    await detailPage.cancelButton.click();

    await detailPage.assertTitle('Cancel Test');
  });

  test('should change status from task list', async ({ request }) => {
    await seedTaskViaApi(request, { title: 'List Status Test' });
    await homePage.goto();

    await homePage.changeTaskStatus('List Status Test', 'completed');

    const taskItem = homePage.getTaskByTitle('List Status Test');
    await expect(taskItem.getByTestId('task-status-select')).toHaveValue('completed');
  });
});
