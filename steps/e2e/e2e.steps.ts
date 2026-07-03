import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../../support/e2e-fixtures';

const { Given, When, Then } = createBdd(test);

Given('the guest is on the hotel homepage', async ({ homePage }) => {
  await homePage.goto();
});

When(
  'they select a room and fill in their details',
  async ({ homePage, roomPage, e2eWorld }, table: { hashes: () => Array<Record<string, string>> }) => {
    const [data] = table.hashes();
    e2eWorld.guestFirstName = data.firstName;
    e2eWorld.guestLastName = data.lastName;

    await homePage.selectRoom();
    await roomPage.openBookingForm();
    await roomPage.fillBookingForm({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
    });
    await roomPage.submitBooking();
  },
);

Then('the booking is confirmed', async ({ roomPage }) => {
  await roomPage.confirmationIsVisible();
});

When('they send a contact message through the UI', async ({ homePage, e2eWorld }) => {
  await homePage.sendMessage({
    name: 'E2E Contact',
    email: 'e2e.contact@test.com',
    phone: '01234567890',
    subject: e2eWorld.contactSubject,
    message: 'This is an end-to-end contact message sent from the automated test suite.',
  });
  e2eWorld.guestFirstName = 'E2E Contact';
});

Then('a confirmation message is shown thanking them', async ({ homePage, e2eWorld }) => {
  await homePage.contactSuccessIsVisible(e2eWorld.guestFirstName);
});

Then('the booking exists in the platform API', async ({ platformApi, e2eWorld }) => {
  await expect
    .poll(
      async () =>
        platformApi.findBookingByGuestName(
          e2eWorld.adminToken,
          e2eWorld.guestFirstName,
          e2eWorld.guestLastName,
        ),
      { timeout: 10000 },
    )
    .toBeDefined();
});

Then('the message exists in the platform API', async ({ platformApi, e2eWorld }) => {
  const message = await platformApi.findMessageBySubject(e2eWorld.contactSubject);
  expect(message).toBeDefined();
  expect(message?.name).toBe('E2E Contact');
});
