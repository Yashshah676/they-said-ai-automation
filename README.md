# Playwright AI Assessment

End-to-end automation framework for [https://ai.theysaid.io/](https://ai.theysaid.io/) using Playwright, TypeScript, and the Page Object Model.

## Covered Flows

- Login with credentials from environment variables.
- Create a project with a timestamped project name.
- Upload `uploads/sample.pdf` in Teach AI and wait for processing to complete.
- Publish the project, capture the generated survey URL, complete the survey, and validate successful submission.

Registration is intentionally skipped because it requires OTP verification.

## Framework Structure

```text
playwright-ai-assessment/
|-- tests/
|   |-- login.spec.ts
|   |-- create-project.spec.ts
|   |-- teach-ai-upload.spec.ts
|   |-- publish-survey.spec.ts
|
|-- pages/
|   |-- LoginPage.ts
|   |-- DashboardPage.ts
|   |-- ProjectPage.ts
|   |-- TeachAIPage.ts
|   |-- PublishPage.ts
|   |-- SurveyPage.ts
|
|-- fixtures/
|   |-- testData.ts
|
|-- utils/
|   |-- logger.ts
|   |-- helpers.ts
|
|-- uploads/
|   |-- sample.pdf
|
|-- playwright.config.ts
|-- .env
|-- .env.example
|-- package.json
|-- README.md
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install
```

3. Configure credentials:

```bash
cp .env.example .env
```

Update `.env` with a valid TheySaid account:

```bash
BASE_URL=https://ai.theysaid.io/
LOGIN_EMAIL=your-real-email
LOGIN_PASSWORD=your-real-password
HEADLESS=true
```

## Run Tests

Run all tests:

```bash
npx playwright test
```

Run headed:

```bash
npx playwright test --headed
```

Show the HTML report:

```bash
npx playwright show-report
```

Run TypeScript validation:

```bash
npm run typecheck
```

## Implementation Notes

- `login.spec.ts` runs as a setup project and stores the authenticated session in `playwright/.auth/user.json`.
- Authenticated projects reuse that storage state, so login is not repeated for every test.
- Tests are parallel-safe because each flow creates its own dynamic project data.
- Playwright is configured with retries, HTML reporting, screenshots on failure, video on failure, and trace collection on first retry.
- Page Objects use role, text, and `data-testid` locators where possible.
- TODO comments identify selectors that should be replaced with stable app-specific selectors after inspecting the live UI.

## Selector Hardening Checklist

After the first headed run, inspect the UI and replace TODO selectors in `pages/` with stable `data-testid` attributes if the app exposes them. Prioritize:

- Login submit button and dashboard marker.
- Create project form fields and submit button.
- Teach AI file input and uploaded document row.
- Publish button and survey URL element.
- Survey form root and submission success message.
