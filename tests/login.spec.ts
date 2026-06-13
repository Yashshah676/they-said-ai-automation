import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { attachScreenshotOnFailure, authFile, ensureDirectory, requireEnv } from '../utils/helpers';
import { Logger } from '../utils/logger';

test.describe('Login flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await test.step('Open application', async () => {
      await loginPage.goto();
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    await attachScreenshotOnFailure(page, testInfo);
  });

  test('logs in with valid credentials and stores session state', async ({ page }) => {
    await test.step('Open login form', async () => {
      await loginPage.openLoginForm();
    });

    await test.step('Submit credentials from environment variables', async () => {
      await loginPage.login(requireEnv('LOGIN_EMAIL'), requireEnv('LOGIN_PASSWORD'));
    });

    await test.step('Validate dashboard is visible', async () => {
      await loginPage.expectLoggedIn();
    });

    await test.step('Persist storage state for authenticated tests', async () => {
      await ensureDirectory(authFile);
      await page.context().storageState({ path: authFile });
      Logger.info(`Stored authenticated session at ${authFile}`);
    });
  });
});
