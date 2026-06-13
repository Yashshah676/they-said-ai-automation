import { uniqueProjectName } from '../utils/helpers';

export const testData = {
  login: {
    email: process.env.LOGIN_EMAIL ?? '',
    password: process.env.LOGIN_PASSWORD ?? ''
  },
  project: {
    name: uniqueProjectName(),
    description: 'Automated Playwright project created for end-to-end validation.',
    objective: 'Collect feedback and validate survey publishing.'
  },
  upload: {
    fileName: 'sample.pdf'
  },
  survey: {
    shortTextAnswer: 'This is an automated survey response.',
    longTextAnswer: 'The project is easy to understand and the automated response was submitted successfully.',
    ratingAnswer: '5',
    rankingAnswers: ['Accuracy', 'Speed', 'Clarity', 'Integration', 'Actionable insights']
  }
};
