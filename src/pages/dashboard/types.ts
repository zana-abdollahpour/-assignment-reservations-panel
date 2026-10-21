import type { Dayjs } from "dayjs";

export type BookingStatus = "تأییدشده" | "در انتظار تأیید" | "لغوشده";

export const BookingStatusQuery = {
  Confirmed: "confirmed",
  Pending: "pending",
  Cancelled: "cancelled",
} as const;

export type BookingStatusQuery =
  (typeof BookingStatusQuery)[keyof typeof BookingStatusQuery];

export type Booking = {
  id: number;
  customer: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
};

export type NewBookingValues = {
  customer: string;
  phone: string;
  service: string;
  date: Dayjs;
  time: Dayjs;
};
