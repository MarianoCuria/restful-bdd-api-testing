import { createBdd } from 'playwright-bdd';
import { test } from '../support/fixtures';

const { When, Then } = createBdd(test);

When(
  'they search for availability from {string} to {string}',
  async ({ homePage }, checkin: string, checkout: string) => {
    await homePage.searchAvailability(checkin, checkout);
  },
);

Then('a list of available rooms is displayed', async ({ homePage }) => {
  await homePage.roomsAreVisible();
});
