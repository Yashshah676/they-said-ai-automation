import { expect, Locator, Page } from '@playwright/test';
import { fillIfVisible } from '../utils/helpers';

type ProjectDetails = {
  name: string;
  description: string;
  objective: string;
};

export class ProjectPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly objectiveInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly projectTitle: Locator;
  readonly teachAITab: Locator;
  readonly aiSurveyOption: Locator;
  readonly createAISurveyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page
      .getByLabel(/survey name|project name|name/i)
      .or(page.getByPlaceholder(/project name|name/i))
      .or(page.getByPlaceholder(/Untitled/i))
      .or(page.locator('[contenteditable="true"]').first())
      .or(page.getByTestId('project-name'));
    this.descriptionInput = page
      .getByLabel(/description/i)
      .or(page.getByPlaceholder(/description/i))
      .or(page.getByTestId('project-description'));
    this.objectiveInput = page
      .getByLabel(/objective|goal|purpose/i)
      .or(page.getByPlaceholder(/objective|goal|purpose/i))
      .or(page.getByTestId('project-objective'));
    this.submitButton = page
      .getByRole('button', { name: /create draft|create project|create|save|continue|next/i })
      .or(page.getByTestId('submit-project'));
    this.successMessage = page
      .getByText(/Draft created|project created|successfully created|created successfully/i)
      .or(page.getByTestId('project-success'));
    this.projectTitle = page.getByRole('heading').or(page.getByTestId('project-title'));
    this.teachAITab = page
      .getByRole('link', { name: /teach ai|training|knowledge/i })
      .or(page.getByRole('button', { name: /teach ai|training|knowledge/i }))
      .or(page.getByTestId('teach-ai-tab'));
    this.aiSurveyOption = page
      .getByRole('button', { name: /AI Survey/i })
      .or(page.getByRole('radio', { name: /AI Survey/i }))
      .or(page.getByText(/^AI Survey$/i));
    this.createAISurveyButton = page.getByRole('button', { name: /Create AI Survey/i });
  }

  async createProject(project: ProjectDetails): Promise<void> {
    if (await this.aiSurveyOption.first().isVisible().catch(() => false)) {
      await this.aiSurveyOption.first().click();

      if (await this.createAISurveyButton.first().isVisible().catch(() => false)) {
        await this.createAISurveyButton.first().click();
      }
    }

    await expect(this.nameInput.first()).toBeVisible({ timeout: 90_000 });
    await this.nameInput.first().fill(project.name);
    await fillIfVisible(this.descriptionInput, project.description);
    await fillIfVisible(this.objectiveInput, project.objective);

    if (await this.submitButton.first().isVisible().catch(() => false)) {
      await this.submitButton.first().click();
    }
  }

  async expectProjectCreated(projectName: string): Promise<void> {
    await expect(this.page).toHaveURL(/\/projects\//, { timeout: 60_000 });
    await expect(
      this.page
        .getByRole('heading', { name: new RegExp(projectName, 'i') })
        .or(this.page.getByText(projectName))
        .or(this.teachAITab)
    ).toBeVisible({ timeout: 60_000 });
  }

  async openTeachAI(): Promise<void> {
    await expect(this.teachAITab.first()).toBeVisible();
    await this.teachAITab.first().click();
  }
}
