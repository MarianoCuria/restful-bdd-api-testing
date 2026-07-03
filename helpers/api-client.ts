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

export interface AuthResponse {
  token?: string;
  reason?: string;
}

// Thin wrapper around Playwright's request context so test files stay clean
// and the HTTP details (headers, base paths) don't leak into every spec.
export class BookingApiClient {
  constructor(private request: APIRequestContext) {}

  async authenticate(username: string, password: string): Promise<AuthResponse> {
    const res = await this.request.post('/auth', {
      data: { username, password },
    });
    return res.json() as Promise<AuthResponse>;
  }

  async getToken(username: string, password: string): Promise<string> {
    const body = await this.authenticate(username, password);
    return body.token ?? '';
  }

  async getAllBookingIds(): Promise<number[]> {
    const res = await this.request.get('/booking');
    const body = await res.json();
    return (body as Array<{ bookingid: number }>).map((b) => b.bookingid);
  }

  async searchBookings(filters: {
    firstname?: string;
    lastname?: string;
    checkin?: string;
    checkout?: string;
  }): Promise<number[]> {
    const params = new URLSearchParams();
    if (filters.firstname) params.set('firstname', filters.firstname);
    if (filters.lastname) params.set('lastname', filters.lastname);
    if (filters.checkin) params.set('checkin', filters.checkin);
    if (filters.checkout) params.set('checkout', filters.checkout);

    const res = await this.request.get(`/booking?${params.toString()}`);
    const body = await res.json();
    return (body as Array<{ bookingid: number }>).map((b) => b.bookingid);
  }

  async getBooking(id: number): Promise<Booking> {
    const res = await this.request.get(`/booking/${id}`);
    return res.json() as Promise<Booking>;
  }

  async getBookingStatus(id: number): Promise<{ status: number; body: string }> {
    const res = await this.request.get(`/booking/${id}`);
    return { status: res.status(), body: await res.text() };
  }

  async createBooking(data: Booking): Promise<BookingResponse> {
    const res = await this.request.post('/booking', { data });
    return res.json() as Promise<BookingResponse>;
  }

  async createBookingRaw(data: unknown): Promise<{ status: number; body: string }> {
    const res = await this.request.post('/booking', { data });
    return { status: res.status(), body: await res.text() };
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

  async updateBookingWithoutAuth(id: number, data: Booking): Promise<number> {
    const res = await this.request.put(`/booking/${id}`, {
      data,
      headers: { Accept: 'application/json' },
    });
    return res.status();
  }

  async deleteBooking(id: number, token: string): Promise<number> {
    const res = await this.request.delete(`/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
    return res.status();
  }
}
