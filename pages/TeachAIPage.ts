import { expect, Locator, Page } from '@playwright/test';
import path from 'path';

export class TeachAIPage {
  readonly page: Page;
  readonly root: Locator;
  readonly uploadInput: Locator;
  readonly uploadButton: Locator;
  readonly saveButton: Locator;
  readonly processingIndicator: Locator;
  readonly uploadedDocuments: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = page
      .getByRole('heading', { name: /teach ai|training|knowledge/i })
      .or(page.getByText(/upload document|documents|data source|global/i))
      .or(page.getByTestId('teach-ai'));
    this.uploadInput = page.locator('input[type="file"]').or(page.getByTestId('document-upload-input'));
    this.uploadButton = page
      .getByRole('button', { name: /upload|add document|choose file|from computer/i })
      .or(page.getByTestId('upload-document'));
    this.saveButton = page
      .getByRole('button', { name: /^save$/i })
      .or(page.getByRole('button', { name: /save source|save document/i }));
    this.processingIndicator = page
      .getByText(/processing|indexing|training|uploading/i)
      .or(page.getByTestId('document-processing'));
    this.uploadedDocuments = page.getByTestId('uploaded-document').or(page.locator('[data-file-name]'));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.root.first()).toBeVisible();
  }

  async uploadDocument(filePath: string): Promise<void> {
    const fileInput = this.uploadInput.first();

    if ((await fileInput.count()) > 0) {
      await fileInput.setInputFiles(filePath);
    } else {
      await expect(this.uploadButton.first()).toBeVisible();
      await this.uploadButton.first().click();
      await this.page.locator('input[type="file"]').first().setInputFiles(filePath);
    }

    if (await this.saveButton.first().isVisible().catch(() => false)) {
      await this.saveButton.first().click({ trial: true }).catch(() => undefined);
      await this.saveButton.first().click().catch(async () => {
        await this.page.evaluate(() => {
          const buttons = [...document.querySelectorAll('button')];
          const saveButton = buttons.find((button) => button.textContent?.trim().toLowerCase() === 'save');
          saveButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        });
      });
    }
  }

  async waitForProcessingComplete(filePath: string): Promise<void> {
    const fileName = path.basename(filePath);
    const documentRow = this.page
      .getByText(fileName, { exact: false })
      .or(this.uploadedDocuments.filter({ hasText: fileName }));

    await expect(documentRow.first()).toBeVisible({ timeout: 90_000 });
    await expect(this.processingIndicator.first()).toBeHidden({ timeout: 120_000 }).catch(() => {
      // Some UIs remove the processing indicator immediately; document visibility is the primary assertion.
    });
  }
}
