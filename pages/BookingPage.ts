import { Page, expect } from '@playwright/test';

export class BookingPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async selectRoom() {
    await this.page.getByRole('button', { name: /book this room/i }).first().click();
  }

  async fillBookingForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    checkIn: string;
    checkOut: string;
  }) {
    await this.page.getByPlaceholder('Firstname').fill(data.firstName);
    await this.page.getByPlaceholder('Lastname').fill(data.lastName);
    await this.page.getByPlaceholder('Email').fill(data.email);
    await this.page.getByPlaceholder('Phone').fill(data.phone);
  }

  async submitBooking() {
    await this.page.getByRole('button', { name: /book/i }).last().click();
  }

  async confirmationIsVisible(firstName: string, lastName: string) {
    await expect(
      this.page.getByText(/Booking Successful!/i)
    ).toBeVisible({ timeout: 10000 });
    await expect(
      this.page.getByText(`${firstName} ${lastName}`)
    ).toBeVisible();
  }
}
