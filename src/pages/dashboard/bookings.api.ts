import type { Booking } from "./types";
import { toEnglishDigits } from "@/utils/numbers.utils";

export type BookingPayload = Omit<Booking, "id">;
export type BookingPage = {
  items: Booking[];
  total: number;
  page: number;
  pageSize: number;
};
export type BookingSummary = {
  total: number;
  today: number;
  confirmed: number;
  cancelled: number;
};

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new Error("ارتباط با سرور برقرار نشد.");
  }

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(error?.message ?? "در انجام درخواست مشکلی پیش آمد.");
  }

  return response.json() as Promise<T>;
}

export const bookingsApi = {
  list: (query: string) => {
    const params = new URLSearchParams(query);
    params.set("pageSize", "8");
    params.set("q", toEnglishDigits(params.get("q") ?? ""));
    return request<BookingPage>(`/api/bookings?${params.toString()}`);
  },
  summary: () => request<BookingSummary>("/api/bookings/summary"),
  create: (booking: BookingPayload) =>
    request<Booking>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    }),
  update: (id: number, booking: BookingPayload) =>
    request<Booking>(`/api/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify(booking),
    }),
  remove: (id: number) =>
    request<Booking>(`/api/bookings/${id}`, { method: "DELETE" }),
};
