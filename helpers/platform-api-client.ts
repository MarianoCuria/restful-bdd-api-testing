import { APIRequestContext } from '@playwright/test';

export interface PlatformMessage {
  id: number;
  name: string;
  read: boolean;
  subject: string;
}

export interface PlatformBooking {
  bookingid?: number;
  bookingId?: number;
  firstname?: string;
  lastname?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface PlatformBookingReportEntry {
  title: string;
  start: string;
  end: string;
}

export class PlatformApiClient {
  constructor(
    private request: APIRequestContext,
    private baseURL = 'https://automationintesting.online',
  ) {}

  private authHeaders(token: string) {
    return { Cookie: `token=${token}` };
  }

  async login(username: string, password: string): Promise<string> {
    const res = await this.request.post(`${this.baseURL}/api/auth/login`, {
      data: { username, password },
    });
    const body = (await res.json()) as { token?: string };
    return body.token ?? '';
  }

  async getMessages(): Promise<PlatformMessage[]> {
    const res = await this.request.get(`${this.baseURL}/api/message`);
    const body = (await res.json()) as { messages?: PlatformMessage[] };
    return body.messages ?? [];
  }

  async getBookingsForRoom(token: string, roomId: number): Promise<PlatformBooking[]> {
    const res = await this.request.get(`${this.baseURL}/api/booking?roomid=${roomId}`, {
      headers: this.authHeaders(token),
    });
    const body = (await res.json()) as { bookings: PlatformBooking[] };
    return body.bookings;
  }

  async getReport(token: string): Promise<PlatformBookingReportEntry[]> {
    const res = await this.request.get(`${this.baseURL}/api/report`, {
      headers: this.authHeaders(token),
    });
    const body = (await res.json()) as { report?: PlatformBookingReportEntry[] };
    return body.report ?? [];
  }

  async getBookings(token: string): Promise<PlatformBooking[]> {
    const res = await this.request.get(`${this.baseURL}/api/booking`, {
      headers: this.authHeaders(token),
    });
    const body = await res.json();

    if (Array.isArray(body)) return body as PlatformBooking[];
    if (Array.isArray(body.bookings)) return body.bookings as PlatformBooking[];
    return [];
  }

  async findBookingByGuestName(
    token: string,
    firstName: string,
    lastName: string,
    roomId = 1,
  ): Promise<PlatformBooking | undefined> {
    const bookings = await this.getBookingsForRoom(token, roomId);
    return bookings.find(
      (booking) => booking.firstname === firstName && booking.lastname === lastName,
    );
  }

  async findMessageBySubject(subject: string): Promise<PlatformMessage | undefined> {
    const messages = await this.getMessages();
    return messages.find((message) => message.subject === subject);
  }
}
