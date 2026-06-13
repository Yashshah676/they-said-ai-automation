import { test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { ProjectPage } from '../pages/ProjectPage';
import { PublishPage } from '../pages/PublishPage';
import { SurveyPage } from '../pages/SurveyPage';
import { TeachAIPage } from '../pages/TeachAIPage';
import { testData } from '../fixtures/testData';
import { attachScreenshotOnFailure, samplePdfPath, uniqueProjectName } from '../utils/helpers';
import { Logger } from '../utils/logger';

test.describe('Publish project and complete survey flow', () => {
  let dashboardPage: DashboardPage;
  let projectPage: ProjectPage;
  let teachAIPage: TeachAIPage;
  let publishPage: PublishPage;
  let surveyPage: SurveyPage;
  let projectName: string;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);
    projectPage = new ProjectPage(page);
    teachAIPage = new TeachAIPage(page);
    publishPage = new PublishPage(page);
    surveyPage = new SurveyPage(page);
    projectName = uniqueProjectName('Published Survey Project');

    await test.step('Open authenticated dashboard', async () => {
      await page.goto('/projects');
      await dashboardPage.expectLoaded();
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    await attachScreenshotOnFailure(page, testInfo);
  });

  test('publishes a project and submits the generated survey', async () => {
    let surveyUrl = '';

    await test.step('Create project', async () => {
      await dashboardPage.startProjectCreation();
      await projectPage.createProject({
        ...testData.project,
        name: projectName
      });
      await projectPage.expectProjectCreated(projectName);
    });

    await test.step('Upload Teach AI source document', async () => {
      await projectPage.openTeachAI();
      await teachAIPage.expectLoaded();
      await teachAIPage.uploadDocument(samplePdfPath);
      await teachAIPage.waitForProcessingComplete(samplePdfPath);
    });

    await test.step('Publish project and capture survey URL', async () => {
      await publishPage.open();
      await publishPage.publish();
      surveyUrl = await publishPage.getSurveyUrl();
      Logger.info(`Generated survey URL: ${surveyUrl}`);
    });

    await test.step('Open generated survey', async () => {
      await surveyPage.goto(surveyUrl);
    });

    await test.step('Fill and submit survey response', async () => {
      await surveyPage.fillSurvey(testData.survey);
      await surveyPage.submit();
    });

    await test.step('Validate survey submission success', async () => {
      await surveyPage.expectSubmitted();
    });
  });
});
