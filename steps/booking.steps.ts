import { expect } from 'playwright-bdd';
import { createBdd } from 'playwright-bdd';
import { test } from '../support/fixtures';

const { Given, When, Then } = createBdd(test);

Given('the guest is on the hotel homepage', async ({ bookingPage }) => {
  await bookingPage.goto();
});

When(
  'they select a room and fill in their details',
  async ({ bookingPage }, table: { hashes: () => Array<Record<string, string>> }) => {
    const [data] = table.hashes();
    await bookingPage.selectRoom();
    await bookingPage.fillBookingForm({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      checkIn: '',
      checkOut: '',
    });
    await bookingPage.submitBooking();
  },
);

Then(
  'the booking is confirmed with the guest name {string}',
  async ({ bookingPage }, guestName: string) => {
    const [firstName, lastName] = guestName.split(' ');
    await bookingPage.confirmationIsVisible(firstName, lastName);
  },
);

When('they try to book a room without providing their email', async ({ bookingPage }) => {
  await bookingPage.selectRoom();
  await bookingPage.fillBookingForm({
    firstName: 'Jane',
    lastName: 'Smith',
    email: '',
    phone: '01234567890',
    checkIn: '',
    checkOut: '',
  });
  await bookingPage.submitBooking();
});

Then(
  'an error message is shown asking for the missing information',
  async ({ page }) => {
    await expect(page.getByText(/must not be empty|Email should not be blank/i)).toBeVisible({
      timeout: 5000,
    });
  },
);
