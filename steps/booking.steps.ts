import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../support/fixtures';

const { Given, When, Then } = createBdd(test);

Given('the guest is on the hotel homepage', async ({ homePage }) => {
  await homePage.goto();
});

When(
  'they select a room and fill in their details',
  async ({ homePage, roomPage }, table: { hashes: () => Array<Record<string, string>> }) => {
    const [data] = table.hashes();
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

When(
  'they try to book a room without providing their {word}',
  async ({ homePage, roomPage }, field: string) => {
    await homePage.selectRoom();
    await roomPage.openBookingForm();
    await roomPage.fillBookingForm({
      firstName: field === 'firstname' ? '' : 'Jane',
      lastName: field === 'lastname' ? '' : 'Smith',
      email: field === 'email' ? '' : 'jane@example.com',
      phone: field === 'phone' ? '' : '01234567890',
    });
    await roomPage.submitBooking();
  },
);

Then(
  'an error message is shown asking for the missing information',
  async ({ page }) => {
    await expect(
      page.getByText(/must not be empty|should not be blank/i)
    ).toBeVisible({ timeout: 5000 });
  },
);

When(
  'they select the {word} room and complete the booking',
  async ({ homePage, roomPage }, roomType: string) => {
    await homePage.selectRoomByType(roomType);
    await roomPage.openBookingForm();
    await roomPage.fillBookingForm({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '01234567890',
    });
    await roomPage.submitBooking();
  },
);
