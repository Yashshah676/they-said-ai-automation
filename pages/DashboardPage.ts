import { expect, Locator, Page } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly dashboardRoot: Locator;
  readonly createProjectButton: Locator;
  readonly projectCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardRoot = page
      .getByRole('heading', { name: /AI Projects/i })
      .or(page.getByRole('link', { name: /^AI Projects$/i }))
      .or(page.getByRole('button', { name: /Add project/i }));
    this.createProjectButton = page
      .getByRole('button', { name: /Add project/i })
      .or(page.getByRole('button', { name: /create project|new project|create/i }))
      .or(page.getByRole('link', { name: /create project|new project|create/i }))
      .or(page.getByTestId('create-project'));
    this.projectCards = page.getByTestId('project-card').or(page.locator('a[href*="/projects/"]'));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.dashboardRoot.first()).toBeVisible();
  }

  async startProjectCreation(): Promise<void> {
    await expect(this.createProjectButton.first()).toBeVisible();
    await this.createProjectButton.first().click();
  }

  async openProject(projectName: string): Promise<void> {
    const projectByName = this.page
      .getByRole('link', { name: new RegExp(projectName, 'i') })
      .or(this.page.getByRole('button', { name: new RegExp(projectName, 'i') }))
      .or(this.page.getByText(projectName, { exact: false }));

    await expect(projectByName.first()).toBeVisible();
    await projectByName.first().click();
  }
}
