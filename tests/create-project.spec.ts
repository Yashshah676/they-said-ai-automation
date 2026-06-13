import { test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { ProjectPage } from '../pages/ProjectPage';
import { testData } from '../fixtures/testData';
import { attachScreenshotOnFailure, uniqueProjectName } from '../utils/helpers';

test.describe('Create Project flow', () => {
  let dashboardPage: DashboardPage;
  let projectPage: ProjectPage;
  let projectName: string;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    projectPage = new ProjectPage(page);
    projectName = uniqueProjectName();

    await test.step('Open authenticated dashboard', async () => {
      await page.goto('/projects');
      await dashboardPage.expectLoaded();
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    await attachScreenshotOnFailure(page, testInfo);
  });

  test('creates a project with dynamic test data', async () => {
    await test.step('Navigate to create project form', async () => {
      await dashboardPage.startProjectCreation();
    });

    await test.step('Fill required project details', async () => {
      await projectPage.createProject({
        ...testData.project,
        name: projectName
      });
    });

    await test.step('Validate project was created successfully', async () => {
      await projectPage.expectProjectCreated(projectName);
    });
  });
});
