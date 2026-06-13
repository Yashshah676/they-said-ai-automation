import { expect, Locator, Page } from '@playwright/test';

type SurveyAnswers = {
  shortTextAnswer: string;
  longTextAnswer: string;
  ratingAnswer: string;
  rankingAnswers: string[];
};

export class SurveyPage {
  readonly page: Page;
  readonly surveyRoot: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.surveyRoot = page
      .getByRole('form')
      .or(page.getByText(/survey|feedback|question|required/i))
      .or(page.getByTestId('survey-form'));
    this.submitButton = page
      .getByRole('button', { name: /submit|finish|complete|send/i })
      .or(page.getByTestId('submit-survey'));
    this.successMessage = page
      .getByText(/thank you|submitted|response recorded|success/i)
      .or(page.getByTestId('survey-success'));
  }

  async goto(surveyUrl: string): Promise<void> {
    await this.page.goto(surveyUrl);
    await expect(this.surveyRoot.first()).toBeVisible();
  }

  async fillSurvey(answers: SurveyAnswers): Promise<void> {
    await this.fillGeneratedSurvey(answers);
  }

  async submit(): Promise<void> {
    await expect(this.submitButton.first()).toBeEnabled();
    await this.submitButton.first().click();
  }

  async expectSubmitted(): Promise<void> {
    await expect(this.successMessage.first()).toBeVisible({ timeout: 30_000 });
  }

  private async fillGeneratedSurvey(answers: SurveyAnswers): Promise<void> {
    await this.page.evaluate(async (surveyAnswers) => {
      const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
      const textOf = (element: Element | null) => element?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
      const isVisible = (element: Element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== 'hidden' && style.display !== 'none' && rect.width > 0 && rect.height > 0;
      };
      const candidates = (selector: string) => [...document.querySelectorAll(selector)].filter(isVisible);
      const clickElement = async (element: Element) => {
        element.scrollIntoView({ block: 'center', inline: 'center' });
        await sleep(80);
        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        await sleep(250);
      };
      const findByText = (text: string, selector = 'button, [role="option"], [role="menuitem"], label, div, span') =>
        candidates(selector).find((element) => textOf(element).toLowerCase() === text.toLowerCase()) ??
        candidates(selector).find((element) => textOf(element).toLowerCase().includes(text.toLowerCase()));
      const setFieldValue = (element: HTMLInputElement | HTMLTextAreaElement, value: string) => {
        element.focus();
        element.value = value;
        element.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: value }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      };
      const clickNavigation = async () => {
        const next = candidates('button').find((button) => /next|continue|start/i.test(textOf(button)) && !(button as HTMLButtonElement).disabled);
        if (next) {
          await clickElement(next);
          return true;
        }
        return false;
      };
      const openResponseControl = async () => {
        const control = candidates('button, [role="button"], [role="combobox"]').find((element) =>
          /choose|select|response|rating|answer/i.test(textOf(element))
        );
        if (control) {
          await clickElement(control);
          return true;
        }
        return false;
      };
      const selectRating = async () => {
        await openResponseControl();
        const option =
          findByText(surveyAnswers.ratingAnswer, 'button, [role="option"], [role="menuitem"], div, span') ??
          candidates('button, [role="option"], [role="menuitem"]').find((element) => /^[1-5]$/.test(textOf(element)));
        if (option) {
          await clickElement(option);
          return true;
        }
        return false;
      };
      const fillTextQuestion = () => {
        const textField = candidates('textarea, input[type="text"]').find((element) => {
          const field = element as HTMLInputElement | HTMLTextAreaElement;
          return !field.value && !field.disabled && !field.readOnly;
        }) as HTMLInputElement | HTMLTextAreaElement | undefined;
        if (!textField) {
          return false;
        }
        const existingTextAreaAnswers = candidates('textarea').filter((element) => (element as HTMLTextAreaElement).value).length;
        const value = existingTextAreaAnswers === 0 ? surveyAnswers.shortTextAnswer : surveyAnswers.longTextAnswer;
        setFieldValue(textField, value);
        return true;
      };
      const answerRanking = async () => {
        const bodyText = textOf(document.body);
        const hasRankingOptions = surveyAnswers.rankingAnswers.some((answer) => bodyText.includes(answer));
        if (!hasRankingOptions) {
          return false;
        }

        await openResponseControl();
        for (const answer of surveyAnswers.rankingAnswers) {
          const option = findByText(answer, 'button, [role="option"], [role="menuitem"], label, div, span');
          if (option) {
            await clickElement(option);
          }
        }
        return true;
      };

      for (let index = 0; index < 12; index += 1) {
        const before = textOf(document.body);
        fillTextQuestion();
        await answerRanking();
        await selectRating();
        await clickNavigation();
        await sleep(400);
        if (before === textOf(document.body) && index > 2) {
          break;
        }
      }
    }, answers);
  }
}
