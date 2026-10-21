import type { Dayjs } from "dayjs";

export type BookingStatus = "تأییدشده" | "در انتظار تأیید" | "لغوشده";

export enum BookingStatusQuery {
  Confirmed = "confirmed",
  Pending = "pending",
  Cancelled = "cancelled",
}

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
