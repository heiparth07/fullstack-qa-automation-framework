import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly url = '/';

  get taskForm(): Locator {
    return this.page.getByTestId('task-form');
  }

  get titleInput(): Locator {
    return this.page.getByTestId('task-title-input');
  }

  get descriptionInput(): Locator {
    return this.page.getByTestId('task-description-input');
  }

  get prioritySelect(): Locator {
    return this.page.getByTestId('task-priority-select');
  }

  get submitButton(): Locator {
    return this.page.getByTestId('task-submit-btn');
  }

  get taskList(): Locator {
    return this.page.getByTestId('task-list');
  }

  get emptyState(): Locator {
    return this.page.getByTestId('empty-state');
  }

  get loadingIndicator(): Locator {
    return this.page.getByTestId('loading-indicator');
  }

  get statusFilter(): Locator {
    return this.page.getByTestId('filter-status');
  }

  get priorityFilter(): Locator {
    return this.page.getByTestId('filter-priority');
  }

  get formError(): Locator {
    return this.page.getByTestId('form-error');
  }

  async waitForReady() {
    await this.page.waitForSelector('[data-testid="task-form"]');
  }

  async createTask(title: string, description?: string, priority?: string) {
    await this.titleInput.fill(title);
    if (description) {
      await this.descriptionInput.fill(description);
    }
    if (priority) {
      await this.prioritySelect.selectOption(priority);
    }
    const responsePromise = this.page.waitForResponse(
      (r) => r.url().includes('/api/tasks') && r.request().method() === 'POST',
    );
    await this.submitButton.click();
    await responsePromise;
    await this.waitForNetworkIdle();
  }

  getTaskByTitle(title: string): Locator {
    return this.page.locator('.task-item', { hasText: title });
  }

  async getTaskCount(): Promise<number> {
    const items = this.page.locator('.task-item');
    return items.count();
  }

  async deleteTaskByTitle(title: string) {
    const taskItem = this.page.locator('.task-item', { hasText: title });
    this.page.on('dialog', (dialog) => dialog.accept());
    await taskItem.getByTestId('task-delete-btn').click();
    await this.waitForNetworkIdle();
  }

  async changeTaskStatus(title: string, newStatus: string) {
    const taskItem = this.page.locator('.task-item', { hasText: title });
    await taskItem.getByTestId('task-status-select').selectOption(newStatus);
    await this.waitForNetworkIdle();
  }

  async filterByStatus(status: string) {
    await this.statusFilter.selectOption(status);
    await this.waitForNetworkIdle();
  }

  async filterByPriority(priority: string) {
    await this.priorityFilter.selectOption(priority);
    await this.waitForNetworkIdle();
  }

  async clickTaskTitle(title: string) {
    await this.page.getByTestId('task-title').filter({ hasText: title }).click();
  }

  async assertTaskVisible(title: string) {
    await expect(this.page.locator('.task-item', { hasText: title })).toBeVisible();
  }

  async assertTaskNotVisible(title: string) {
    await expect(this.page.locator('.task-item', { hasText: title })).not.toBeVisible();
  }
}
