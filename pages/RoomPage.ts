import { Page, expect } from '@playwright/test';

export class RoomPage {
  constructor(private page: Page) {}

  private futureDates(): { checkin: string; checkout: string } {
    // Spread dates across runs to avoid booking conflicts on the shared demo site
    const daysAhead = 90 + (Date.now() % 240);
    const checkin = new Date();
    checkin.setDate(checkin.getDate() + daysAhead);
    const checkout = new Date(checkin);
    checkout.setDate(checkout.getDate() + 2);
    const fmt = (d: Date) => d.toISOString().split('T')[0];
    return { checkin: fmt(checkin), checkout: fmt(checkout) };
  }

  async openBookingForm(dates?: { checkin: string; checkout: string }) {
    const { checkin, checkout } = dates ?? this.futureDates();
    const currentUrl = new URL(this.page.url());
    currentUrl.searchParams.set('checkin', checkin);
    currentUrl.searchParams.set('checkout', checkout);
    await this.page.goto(currentUrl.toString());
    await this.page.getByRole('button', { name: 'Reserve Now' }).click();
  }

  async fillBookingForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) {
    await this.page.getByPlaceholder('Firstname').fill(data.firstName);
    await this.page.getByPlaceholder('Lastname').fill(data.lastName);
    await this.page.getByPlaceholder('Email').fill(data.email);
    await this.page.getByPlaceholder('Phone').fill(data.phone);
  }

  async submitBooking() {
    await this.page.getByRole('button', { name: 'Reserve Now' }).click();
  }

  async confirmationIsVisible() {
    await expect(
      this.page.getByRole('heading', { name: 'Booking Confirmed' })
    ).toBeVisible({ timeout: 10000 });
    await expect(
      this.page.getByText('Your booking has been confirmed for the following dates:')
    ).toBeVisible();
  }
}
