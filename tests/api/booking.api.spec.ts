import { test, expect, request as playwrightRequest, APIRequestContext } from '@playwright/test';
import { BookingApiClient, Booking } from '../../helpers/api-client';

// Restful Booker default admin credentials (public demo instance).
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'password123';

const BASE_BOOKING: Booking = {
  firstname: 'Carlos',
  lastname: 'Garcia',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2026-08-01', checkout: '2026-08-05' },
  additionalneeds: 'Breakfast',
};

test.describe('Booking API — CRUD', () => {
  let client: BookingApiClient;
  let authToken: string;
  let createdBookingId: number;
  let requestContext: APIRequestContext;

  // Create a standalone APIRequestContext so it can be safely shared
  // across all tests in this describe block (the fixture-based `request`
  // from beforeAll cannot be reused in individual tests per Playwright rules).
  test.beforeAll(async () => {
    requestContext = await playwrightRequest.newContext({
      baseURL: 'https://restful-booker.herokuapp.com',
    });
    client = new BookingApiClient(requestContext);
    authToken = await client.getToken(ADMIN_USER, ADMIN_PASS);
    expect(authToken).toBeTruthy();
  });

  test.afterAll(async () => {
    await requestContext.dispose();
  });

  test('GET /booking — returns a non-empty list of booking ids', async () => {
    const ids = await client.getAllBookingIds();
    expect(ids.length).toBeGreaterThan(0);
    ids.forEach((id) => expect(typeof id).toBe('number'));
  });

  test('POST /booking — creates a new booking with correct data', async () => {
    const response = await client.createBooking(BASE_BOOKING);
    createdBookingId = response.bookingid;

    expect(typeof createdBookingId).toBe('number');
    expect(response.booking.firstname).toBe(BASE_BOOKING.firstname);
    expect(response.booking.lastname).toBe(BASE_BOOKING.lastname);
    expect(response.booking.totalprice).toBe(BASE_BOOKING.totalprice);
    expect(response.booking.bookingdates.checkin).toBe(BASE_BOOKING.bookingdates.checkin);
    expect(response.booking.bookingdates.checkout).toBe(BASE_BOOKING.bookingdates.checkout);
  });

  test('GET /booking/:id — retrieves the booking just created', async () => {
    test.skip(!createdBookingId, 'Skipped: booking was not created in previous test');

    const booking = await client.getBooking(createdBookingId);
    expect(booking.firstname).toBe(BASE_BOOKING.firstname);
    expect(booking.lastname).toBe(BASE_BOOKING.lastname);
    expect(booking.depositpaid).toBe(true);
  });

  test('PUT /booking/:id — updates the booking with new dates', async () => {
    test.skip(!createdBookingId, 'Skipped: booking was not created in previous test');

    const updated: Booking = {
      ...BASE_BOOKING,
      bookingdates: { checkin: '2026-09-01', checkout: '2026-09-03' },
      additionalneeds: 'Late checkout',
    };

    const result = await client.updateBooking(createdBookingId, updated, authToken);
    expect(result.bookingdates.checkin).toBe('2026-09-01');
    expect(result.bookingdates.checkout).toBe('2026-09-03');
    expect(result.additionalneeds).toBe('Late checkout');
  });

  test('DELETE /booking/:id — deletes the booking and returns 201', async () => {
    test.skip(!createdBookingId, 'Skipped: booking was not created in previous test');

    const status = await client.deleteBooking(createdBookingId, authToken);
    expect(status).toBe(201);
  });
});
