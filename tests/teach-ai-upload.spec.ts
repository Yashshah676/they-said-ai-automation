import { test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { ProjectPage } from '../pages/ProjectPage';
import { TeachAIPage } from '../pages/TeachAIPage';
import { testData } from '../fixtures/testData';
import { attachScreenshotOnFailure, samplePdfPath, uniqueProjectName } from '../utils/helpers';

test.describe('Teach AI upload flow', () => {
  let dashboardPage: DashboardPage;
  let projectPage: ProjectPage;
  let teachAIPage: TeachAIPage;
  let projectName: string;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    projectPage = new ProjectPage(page);
    teachAIPage = new TeachAIPage(page);
    projectName = uniqueProjectName('Teach AI Project');

    await test.step('Open authenticated dashboard', async () => {
      await page.goto('/projects');
      await dashboardPage.expectLoaded();
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    await attachScreenshotOnFailure(page, testInfo);
  });

  test('uploads a PDF document to Teach AI', async () => {
    await test.step('Create a project for document training', async () => {
      await dashboardPage.startProjectCreation();
      await projectPage.createProject({
        ...testData.project,
        name: projectName
      });
      await projectPage.expectProjectCreated(projectName);
    });

    await test.step('Open Teach AI section', async () => {
      await projectPage.openTeachAI();
      await teachAIPage.expectLoaded();
    });

    await test.step('Upload sample PDF', async () => {
      await teachAIPage.uploadDocument(samplePdfPath);
    });

    await test.step('Validate document processing completed', async () => {
      await teachAIPage.waitForProcessingComplete(samplePdfPath);
    });
  });
});
