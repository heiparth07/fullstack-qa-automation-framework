import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TaskDetailPage extends BasePage {
  readonly url = '/tasks';

  get detailTitle(): Locator {
    return this.page.getByTestId('detail-title');
  }

  get detailDescription(): Locator {
    return this.page.getByTestId('detail-description');
  }

  get detailStatus(): Locator {
    return this.page.getByTestId('detail-status');
  }

  get detailPriority(): Locator {
    return this.page.getByTestId('detail-priority');
  }

  get editButton(): Locator {
    return this.page.getByTestId('edit-btn');
  }

  get deleteButton(): Locator {
    return this.page.getByTestId('delete-btn');
  }

  get backButton(): Locator {
    return this.page.getByTestId('back-btn');
  }

  get editTitleInput(): Locator {
    return this.page.getByTestId('edit-title-input');
  }

  get editDescriptionInput(): Locator {
    return this.page.getByTestId('edit-description-input');
  }

  get editStatusSelect(): Locator {
    return this.page.getByTestId('edit-status-select');
  }

  get editPrioritySelect(): Locator {
    return this.page.getByTestId('edit-priority-select');
  }

  get saveButton(): Locator {
    return this.page.getByTestId('save-btn');
  }

  get cancelButton(): Locator {
    return this.page.getByTestId('cancel-btn');
  }

  async waitForReady() {
    await this.page.waitForSelector('[data-testid="task-detail"]');
  }

  async editTitle(newTitle: string) {
    await this.editButton.click();
    await this.editTitleInput.clear();
    await this.editTitleInput.fill(newTitle);
    await this.saveButton.click();
    await this.waitForNetworkIdle();
  }

  async editDescription(newDescription: string) {
    await this.editButton.click();
    await this.editDescriptionInput.clear();
    await this.editDescriptionInput.fill(newDescription);
    await this.saveButton.click();
    await this.waitForNetworkIdle();
  }

  async changeStatus(newStatus: string) {
    await this.editButton.click();
    await this.editStatusSelect.selectOption(newStatus);
    await this.saveButton.click();
    await this.waitForNetworkIdle();
  }

  async deleteTask() {
    this.page.on('dialog', (dialog) => dialog.accept());
    await this.deleteButton.click();
  }

  async goBack() {
    await this.backButton.click();
  }

  async assertTitle(expected: string) {
    await expect(this.detailTitle).toHaveText(expected);
  }

  async assertDescription(expected: string) {
    await expect(this.detailDescription).toHaveText(expected);
  }

  async assertStatus(expected: string) {
    await expect(this.detailStatus).toContainText(expected);
  }
}
