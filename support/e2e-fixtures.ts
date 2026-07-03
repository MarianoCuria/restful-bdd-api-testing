import { test as base } from 'playwright-bdd';
import { HomePage } from '../pages/HomePage';
import { RoomPage } from '../pages/RoomPage';
import { PlatformApiClient } from '../helpers/platform-api-client';

const PLATFORM_ADMIN_USER = process.env.PLATFORM_ADMIN_USER ?? 'admin';
const PLATFORM_ADMIN_PASSWORD = process.env.PLATFORM_ADMIN_PASSWORD ?? 'password';

export type E2eWorld = {
  adminToken: string;
  guestFirstName: string;
  guestLastName: string;
  contactSubject: string;
};

type E2eFixtures = {
  homePage: HomePage;
  roomPage: RoomPage;
  platformApi: PlatformApiClient;
  e2eWorld: E2eWorld;
};

export const test = base.extend<E2eFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  roomPage: async ({ page }, use) => {
    await use(new RoomPage(page));
  },
  platformApi: async ({ request }, use) => {
    await use(new PlatformApiClient(request));
  },
  e2eWorld: async ({ platformApi }, use) => {
    const adminToken = await platformApi.login(PLATFORM_ADMIN_USER, PLATFORM_ADMIN_PASSWORD);
    await use({
      adminToken,
      guestFirstName: 'E2E',
      guestLastName: 'Guest',
      contactSubject: 'E2E contact inquiry',
    });
  },
});

export { test as default };
