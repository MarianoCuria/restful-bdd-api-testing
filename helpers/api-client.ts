import { APIRequestContext } from '@playwright/test';

export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds?: string;
}

export interface BookingResponse {
  bookingid: number;
  booking: Booking;
}

// Thin wrapper around Playwright's request context so test files stay clean
// and the HTTP details (headers, base paths) don't leak into every spec.
export class BookingApiClient {
  constructor(private request: APIRequestContext) {}

  async getToken(username: string, password: string): Promise<string> {
    const res = await this.request.post('/auth', {
      data: { username, password },
    });
    const body = await res.json();
    return body.token as string;
  }

  async getAllBookingIds(): Promise<number[]> {
    const res = await this.request.get('/booking');
    const body = await res.json();
    return (body as Array<{ bookingid: number }>).map((b) => b.bookingid);
  }

  async getBooking(id: number): Promise<Booking> {
    const res = await this.request.get(`/booking/${id}`);
    return res.json() as Promise<Booking>;
  }

  async createBooking(data: Booking): Promise<BookingResponse> {
    const res = await this.request.post('/booking', { data });
    return res.json() as Promise<BookingResponse>;
  }

  async updateBooking(id: number, data: Booking, token: string): Promise<Booking> {
    const res = await this.request.put(`/booking/${id}`, {
      data,
      headers: {
        Cookie: `token=${token}`,
        Accept: 'application/json',
      },
    });
    return res.json() as Promise<Booking>;
  }

  async deleteBooking(id: number, token: string): Promise<number> {
    const res = await this.request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
    return res.status();
  }
}
