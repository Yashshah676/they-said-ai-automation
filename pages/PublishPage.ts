import { expect, Locator, Page } from '@playwright/test';

export class PublishPage {
  readonly page: Page;
  readonly publishTab: Locator;
  readonly publishButton: Locator;
  readonly publishedMessage: Locator;
  readonly surveyLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.publishTab = page
      .getByRole('link', { name: /publish|share|launch/i })
      .or(page.getByRole('button', { name: /publish|share|launch/i }))
      .or(page.getByTestId('publish-tab'));
    this.publishButton = page
      .getByRole('button', { name: /^publish$|generate survey|launch|make live/i })
      .or(page.getByTestId('publish-project'));
    this.publishedMessage = page
      .getByText(/published|project is live|survey ready|successfully published|copied/i)
      .or(page.getByTestId('publish-success'));
    this.surveyLink = page
      .locator('a[href*="survey"], a[href*="form"], a[href*="share"], input[value*="http"], textarea')
      .or(page.getByTestId('survey-url'));
  }

  async open(): Promise<void> {
    if (await this.publishTab.first().isVisible().catch(() => false)) {
      await this.publishTab.first().click();
    }
  }

  async publish(): Promise<void> {
    await expect(this.publishButton.first()).toBeVisible();
    await this.publishButton.first().click();

    const confirmationButton = this.page.getByRole('button', { name: /publish|confirm|yes|make live/i });
    if (await confirmationButton.first().isVisible().catch(() => false)) {
      await confirmationButton.first().click();
    }

    await expect(this.publishedMessage.first().or(this.surveyLink.first())).toBeVisible({ timeout: 60_000 });
  }

  async getSurveyUrl(): Promise<string> {
    const link = this.surveyLink.first();
    await expect(link).toBeVisible();

    const href = await link.getAttribute('href');
    if (href) {
      return new URL(href, this.page.url()).toString();
    }

    const value = await link.inputValue().catch(() => '');
    if (value) {
      return new URL(value, this.page.url()).toString();
    }

    const text = (await link.textContent())?.trim();
    if (text) {
      const urlMatch = text.match(/https?:\/\/\S+/);
      return new URL(urlMatch?.[0] ?? text, this.page.url()).toString();
    }

    const bodyText = await this.page.locator('body').innerText();
    const urlMatch = bodyText.match(/https?:\/\/\S*(survey|form|share)\S*/i);
    if (urlMatch) {
      return new URL(urlMatch[0], this.page.url()).toString();
    }

    throw new Error('Published survey URL was not available in the expected link/input element.');
  }
}
