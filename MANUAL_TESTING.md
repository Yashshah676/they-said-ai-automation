# Manual Testing Guide

Use this guide before running automation to understand the application behavior, confirm selectors, and identify any OTP, permission, or data issues.

## Pre-Requisites

- Valid existing TheySaid account.
- Login email and password.
- Sample PDF available at `uploads/sample.pdf`.
- Browser access to `https://ai.theysaid.io/`.
- Registration is out of scope because it requires OTP.

## Test Environment

| Field | Value |
| --- | --- |
| Application URL | `https://ai.theysaid.io/` |
| Browser | Chrome / Firefox |
| Test Account | Existing valid account |
| Test Data | Dynamic project name with timestamp |

## Manual Test Cases

### TC-001: Login With Valid Credentials

**Objective:** Verify that an existing user can log in successfully.

**Steps:**

1. Open `https://ai.theysaid.io/`.
2. Click `Login` or `Sign in`.
3. Enter valid email.
4. Enter valid password.
5. Click the login/submit button.

**Expected Result:**

- User is redirected to the dashboard.
- Dashboard or project list is visible.
- No authentication error is displayed.

**Automation Notes:**

- Confirm stable selector for login button.
- Confirm stable selector for email and password fields.
- Confirm stable dashboard validation element.

### TC-002: Login With Invalid Credentials

**Objective:** Verify that invalid credentials are rejected.

**Steps:**

1. Open the login page.
2. Enter an invalid email or password.
3. Click the login/submit button.

**Expected Result:**

- User remains unauthenticated.
- A clear error message is displayed.

**Automation Notes:**

- Optional negative automation case.
- Capture exact error text and selector.

### TC-003: Create Project

**Objective:** Verify that a logged-in user can create a new project.

**Steps:**

1. Log in successfully.
2. From the dashboard, click `Create Project` or `New Project`.
3. Enter project name, for example `Manual Test Project <timestamp>`.
4. Fill all required fields.
5. Submit the form.

**Expected Result:**

- Project is created successfully.
- User sees the project detail page or project appears in the dashboard/project list.
- Project name matches the submitted value.

**Automation Notes:**

- Confirm required fields in the create project form.
- Confirm selectors for project name, description/objective fields, and submit button.
- Confirm final success indicator.

### TC-004: Upload Document In Teach AI

**Objective:** Verify that a PDF can be uploaded to Teach AI.

**Steps:**

1. Open a created project.
2. Navigate to `Teach AI`.
3. Click upload/add document.
4. Select `uploads/sample.pdf`.
5. Wait until upload and processing complete.

**Expected Result:**

- `sample.pdf` appears in uploaded documents.
- Processing status completes successfully.
- No upload error is displayed.

**Automation Notes:**

- Confirm whether the file input is directly accessible.
- Confirm processing status text.
- Confirm uploaded document row/list selector.

### TC-005: Publish Project

**Objective:** Verify that a project can be published.

**Steps:**

1. Open a project that has Teach AI content.
2. Navigate to `Publish`, `Share`, or equivalent section.
3. Click publish/generate survey.
4. Capture the generated survey URL.

**Expected Result:**

- Project is published successfully.
- Survey URL is generated and accessible.

**Automation Notes:**

- Confirm publish button selector.
- Confirm success message.
- Confirm survey URL location, link, or input field selector.

### TC-006: Complete Published Survey

**Objective:** Verify that an end user can complete the generated survey.

**Steps:**

1. Open the generated survey URL in a new browser tab/window.
2. Fill all required survey questions.
3. Submit the survey.

**Expected Result:**

- Survey submission succeeds.
- Thank-you/success message is displayed.

**Automation Notes:**

- Confirm survey form structure.
- Identify required question types: text, rating, radio, checkbox, dropdown.
- Confirm submission success selector.

## Defect Template

Use this format when recording issues:

```text
Title:
Environment:
Browser:
Steps to Reproduce:
Actual Result:
Expected Result:
Screenshot/Video:
Severity:
Notes:
```

## Selector Capture Checklist

During manual testing, capture stable selectors for:

- Login button.
- Email input.
- Password input.
- Dashboard marker.
- Create project button.
- Project form required fields.
- Project creation success indicator.
- Teach AI tab.
- File upload input/button.
- Uploaded document row.
- Processing complete indicator.
- Publish tab/button.
- Survey URL element.
- Survey form fields.
- Survey submit button.
- Survey success message.

Update the TODO comments in `pages/` after this inspection.
