import { test as base } from 'playwright-bdd';
import { HomePage } from '../pages/HomePage';
import { RoomPage } from '../pages/RoomPage';

type MyWorld = {
  homePage: HomePage;
  roomPage: RoomPage;
};

export const test = base.extend<MyWorld>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  roomPage: async ({ page }, use) => {
    await use(new RoomPage(page));
  },
});

export { test as default };
