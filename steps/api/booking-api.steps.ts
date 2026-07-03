import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { Booking } from '../../helpers/api-client';
import { test } from '../../support/api-fixtures';

const { Given, When, Then } = createBdd(test);

Given('the API client is authenticated as admin', async ({ apiClient, apiWorld }) => {
  apiWorld.token = await apiClient.getToken('admin', 'password123');
  expect(apiWorld.token).toBeTruthy();
});

Given('a booking exists', async ({ apiClient, apiWorld }) => {
  const response = await apiClient.createBooking(apiWorld.submittedBooking);
  apiWorld.bookingId = response.bookingid;
  expect(apiWorld.bookingId).toBeGreaterThan(0);
});

When('they request the list of all bookings', async ({ apiClient, apiWorld }) => {
  const ids = await apiClient.getAllBookingIds();
  apiWorld.bookingCount = ids.length;
});

When('they create a new booking', async ({ apiClient, apiWorld }) => {
  const response = await apiClient.createBooking(apiWorld.submittedBooking);
  apiWorld.bookingId = response.bookingid;
});

When(
  'they create a booking for {string} {string}',
  async ({ apiClient, apiWorld }, firstname: string, lastname: string) => {
    apiWorld.submittedBooking = {
      ...apiWorld.submittedBooking,
      firstname,
      lastname,
    };
    const response = await apiClient.createBooking(apiWorld.submittedBooking);
    apiWorld.bookingId = response.bookingid;
  },
);

When('they retrieve the booking by id', async ({ apiClient, apiWorld }) => {
  apiWorld.retrievedBooking = await apiClient.getBooking(apiWorld.bookingId);
});

When('they update the booking with new dates', async ({ apiClient, apiWorld }) => {
  const updated: Booking = {
    ...apiWorld.submittedBooking,
    bookingdates: { checkin: '2026-09-01', checkout: '2026-09-03' },
    additionalneeds: 'Late checkout',
  };
  apiWorld.updatedBooking = await apiClient.updateBooking(
    apiWorld.bookingId,
    updated,
    apiWorld.token,
  );
});

When('they delete the booking', async ({ apiClient, apiWorld }) => {
  apiWorld.deleteStatus = await apiClient.deleteBooking(apiWorld.bookingId, apiWorld.token);
});

When(
  'they authenticate with username {string} and password {string}',
  async ({ apiClient, apiWorld }, username: string, password: string) => {
    const response = await apiClient.authenticate(username, password);
    apiWorld.token = response.token ?? '';
    apiWorld.authReason = response.reason ?? '';
  },
);

When('they try to update the booking without a token', async ({ apiClient, apiWorld }) => {
  apiWorld.unauthorizedStatus = await apiClient.updateBookingWithoutAuth(
    apiWorld.bookingId,
    apiWorld.submittedBooking,
  );
});

When(
  'they search for bookings with firstname {string} and lastname {string}',
  async ({ apiClient, apiWorld }, firstname: string, lastname: string) => {
    apiWorld.searchResults = await apiClient.searchBookings({ firstname, lastname });
  },
);

When(
  'they search for bookings with checkin date {string}',
  async ({ apiClient, apiWorld }, checkin: string) => {
    apiWorld.searchResults = await apiClient.searchBookings({ checkin });
  },
);

When('they request booking id {int}', async ({ apiClient, apiWorld }, id: number) => {
  const response = await apiClient.getBookingStatus(id);
  apiWorld.httpStatus = response.status;
  apiWorld.responseBody = response.body;
});

When('they submit an empty booking payload', async ({ apiClient, apiWorld }) => {
  const response = await apiClient.createBookingRaw({});
  apiWorld.httpStatus = response.status;
  apiWorld.responseBody = response.body;
});

Then('the response contains at least one booking id', async ({ apiWorld }) => {
  expect(apiWorld.bookingCount).toBeGreaterThan(0);
});

Then('the booking details match what was submitted', async ({ apiWorld }) => {
  expect(apiWorld.retrievedBooking.firstname).toBe(apiWorld.submittedBooking.firstname);
  expect(apiWorld.retrievedBooking.lastname).toBe(apiWorld.submittedBooking.lastname);
  expect(apiWorld.retrievedBooking.totalprice).toBe(apiWorld.submittedBooking.totalprice);
  expect(apiWorld.retrievedBooking.bookingdates.checkin).toBe(
    apiWorld.submittedBooking.bookingdates.checkin,
  );
});

Then('the updated booking reflects the changes', async ({ apiWorld }) => {
  expect(apiWorld.updatedBooking.bookingdates.checkin).toBe('2026-09-01');
  expect(apiWorld.updatedBooking.bookingdates.checkout).toBe('2026-09-03');
  expect(apiWorld.updatedBooking.additionalneeds).toBe('Late checkout');
});

Then('the deletion is confirmed', async ({ apiWorld }) => {
  expect(apiWorld.deleteStatus).toBe(201);
});

Then('authentication fails with reason {string}', async ({ apiWorld }, reason: string) => {
  expect(apiWorld.token).toBeFalsy();
  expect(apiWorld.authReason).toBe(reason);
});

Then('the API returns status {int}', async ({ apiWorld }, status: number) => {
  const actual = apiWorld.unauthorizedStatus || apiWorld.httpStatus;
  expect(actual).toBe(status);
});

Then('the search returns at least one booking id', async ({ apiWorld }) => {
  expect(apiWorld.searchResults.length).toBeGreaterThan(0);
});

Then('the search results include the created booking', async ({ apiWorld }) => {
  expect(apiWorld.searchResults).toContain(apiWorld.bookingId);
});

Then('the response body contains {string}', async ({ apiWorld }, text: string) => {
  expect(apiWorld.responseBody).toContain(text);
});
