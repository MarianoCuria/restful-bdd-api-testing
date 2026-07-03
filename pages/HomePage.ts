import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async selectRoom() {
    await this.page.getByRole('link', { name: 'Book now', exact: true }).first().click();
  }

  async selectRoomByType(roomType: string) {
    const roomIndex: Record<string, number> = { Single: 0, Double: 1, Suite: 2 };
    const index = roomIndex[roomType] ?? 0;
    await this.page.getByRole('link', { name: 'Book now', exact: true }).nth(index).click();
  }

  async searchAvailability(checkin: string, checkout: string) {
    const toDisplayFormat = (iso: string) => {
      const [y, m, d] = iso.split('-');
      return `${d}/${m}/${y}`;
    };
    const inputs = this.page.getByRole('textbox');
    await inputs.nth(0).fill(toDisplayFormat(checkin));
    await inputs.nth(1).fill(toDisplayFormat(checkout));
    await this.page.getByRole('button', { name: 'Check Availability' }).click();
  }

  async roomsAreVisible() {
    await expect(
      this.page.getByRole('heading', { name: 'Our Rooms' })
    ).toBeVisible();
    await expect(
      this.page.getByRole('link', { name: 'Book now', exact: true }).first()
    ).toBeVisible();
  }

  async sendMessage(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) {
    await this.page.getByRole('textbox', { name: 'Name' }).fill(data.name);
    await this.page.getByRole('textbox', { name: 'Email' }).fill(data.email);
    await this.page.getByRole('textbox', { name: 'Phone' }).fill(data.phone);
    await this.page.getByRole('textbox', { name: 'Subject' }).fill(data.subject);
    await this.page.locator('textarea').fill(data.message);
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }

  async contactSuccessIsVisible(name: string) {
    await expect(
      this.page.getByRole('heading', { name: `Thanks for getting in touch ${name}!` })
    ).toBeVisible({ timeout: 5000 });
  }

  async contactErrorIsVisible() {
    await expect(
      this.page.locator('.alert.alert-danger')
    ).toBeVisible({ timeout: 5000 });
  }
}
