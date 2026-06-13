import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginEntry: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly dashboardMarker: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginEntry = page
      .getByRole('link', { name: /log in|login|sign in/i })
      .or(page.getByRole('button', { name: /log in|login|sign in/i }))
      .or(page.getByTestId('login-button'));
    this.emailInput = page
      .getByLabel(/email/i)
      .or(page.getByPlaceholder(/email/i))
      .or(page.getByTestId('email-input'));
    this.passwordInput = page
      .getByLabel(/password/i)
      .or(page.getByPlaceholder(/password/i))
      .or(page.getByTestId('password-input'));
    this.submitButton = page
      .getByRole('button', { name: /continue|log in|login|sign in/i })
      .or(page.getByTestId('submit-login'));
    this.dashboardMarker = page
      .getByRole('heading', { name: /AI Projects/i })
      .or(page.getByRole('link', { name: /^AI Projects$/i }))
      .or(page.getByRole('button', { name: /Add project/i }));
  }

  async goto(): Promise<void> {
    await this.page.goto('/home');
    await expect(this.page).toHaveURL(/ai\.theysaid\.io|authkit\.theysaid\.io/);
  }

  async openLoginForm(): Promise<void> {
    if (await this.emailInput.first().isVisible().catch(() => false)) {
      return;
    }

    await expect(this.loginEntry.first()).toBeVisible();
    await this.loginEntry.first().click();
    await expect(this.emailInput.first()).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.first().fill(email);
    await this.submitButton.first().click();

    await expect(this.passwordInput.first()).toBeVisible({ timeout: 30_000 });
    await this.passwordInput.first().fill(password);
    await this.submitButton.first().click();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.dashboardMarker.first()).toBeVisible();
  }
}
