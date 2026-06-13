import { expect, Locator, Page, TestInfo } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export const authFile = path.resolve(__dirname, '../playwright/.auth/user.json');
export const samplePdfPath = path.resolve(__dirname, '../uploads/sample.pdf');

export function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function uniqueProjectName(prefix = 'AI Assessment Project'): string {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  return `${prefix} ${timestamp}`;
}

export async function ensureDirectory(filePath: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
}

export async function attachScreenshotOnFailure(page: Page, testInfo: TestInfo): Promise<void> {
  if (testInfo.status === testInfo.expectedStatus) {
    return;
  }

  const screenshot = await page.screenshot({ fullPage: true });
  await testInfo.attach('failure-screenshot', {
    body: screenshot,
    contentType: 'image/png'
  });
}

export async function fillIfVisible(locator: Locator, value: string): Promise<boolean> {
  if (await locator.first().isVisible().catch(() => false)) {
    await locator.first().fill(value);
    return true;
  }

  return false;
}

export async function clickFirstVisible(locator: Locator): Promise<void> {
  await expect(locator.first()).toBeVisible();
  await locator.first().click();
}

export async function expectAnyVisible(...locators: Locator[]): Promise<void> {
  await expect(locators.reduce((combined, locator) => combined.or(locator))).toBeVisible();
}

export async function getFirstVisibleText(locator: Locator): Promise<string> {
  await expect(locator.first()).toBeVisible();
  return (await locator.first().textContent())?.trim() ?? '';
}
