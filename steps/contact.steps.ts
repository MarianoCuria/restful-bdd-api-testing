import { createBdd } from 'playwright-bdd';
import { test } from '../support/fixtures';

const { When, Then } = createBdd(test);

When('they fill in the contact form with valid details', async ({ homePage }) => {
  await homePage.sendMessage({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '01234567890',
    subject: 'Test inquiry',
    message: 'This is a test message sent from the automated test suite.',
  });
});

When('they submit the contact form without filling any fields', async ({ homePage }) => {
  await homePage.sendMessage({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
});

Then('a confirmation message is shown thanking them', async ({ homePage }) => {
  await homePage.contactSuccessIsVisible('John Doe');
});

Then('an error is shown indicating the required fields are missing', async ({ homePage }) => {
  await homePage.contactErrorIsVisible();
});
