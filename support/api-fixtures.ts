import { test as base } from 'playwright-bdd';
import { BookingApiClient, Booking } from '../helpers/api-client';

export type ApiWorld = {
  token: string;
  authReason: string;
  bookingId: number;
  bookingCount: number;
  searchResults: number[];
  httpStatus: number;
  responseBody: string;
  submittedBooking: Booking;
  retrievedBooking: Booking;
  updatedBooking: Booking;
  deleteStatus: number;
  unauthorizedStatus: number;
};

type ApiFixtures = {
  apiClient: BookingApiClient;
  apiWorld: ApiWorld;
};

export const test = base.extend<ApiFixtures>({
  apiClient: async ({ request }, use) => {
    await use(new BookingApiClient(request));
  },
  apiWorld: async ({}, use) => {
    await use({
      token: '',
      authReason: '',
      bookingId: 0,
      bookingCount: 0,
      searchResults: [],
      httpStatus: 0,
      responseBody: '',
      submittedBooking: {
        firstname: 'Carlos',
        lastname: 'Garcia',
        totalprice: 150,
        depositpaid: true,
        bookingdates: { checkin: '2026-08-01', checkout: '2026-08-05' },
        additionalneeds: 'Breakfast',
      },
      retrievedBooking: {
        firstname: '',
        lastname: '',
        totalprice: 0,
        depositpaid: false,
        bookingdates: { checkin: '', checkout: '' },
      },
      updatedBooking: {
        firstname: '',
        lastname: '',
        totalprice: 0,
        depositpaid: false,
        bookingdates: { checkin: '', checkout: '' },
      },
      deleteStatus: 0,
      unauthorizedStatus: 0,
    });
  },
});

export { test as default };
