import { test as base, expect } from 'playwright-bdd';
import { BookingPage } from '../pages/BookingPage';

type MyWorld = {
  bookingPage: BookingPage;
};

export const test = base.extend<MyWorld>({
  bookingPage: async ({ page }, use) => {
    await use(new BookingPage(page));
  },
});

export { expect };
export { test as default };
