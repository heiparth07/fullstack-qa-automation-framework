import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  abstract readonly url: string;

  async goto() {
    await this.page.goto(this.url);
    await this.waitForReady();
  }

  abstract waitForReady(): Promise<void>;

  get navHome(): Locator {
    return this.page.getByTestId('nav-home');
  }

  async navigateHome() {
    await this.navHome.click();
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForNetworkIdle() {
    await this.page.waitForLoadState('networkidle');
  }
}
