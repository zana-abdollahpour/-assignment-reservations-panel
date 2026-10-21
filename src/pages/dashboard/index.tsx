import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import dayjs from "dayjs";
import "jalaliday";

import { BookingStats } from "./booking-stats";
import { BookingTable } from "./booking-table";
import { initialBookings } from "./mock-data";
import { NewBookingModal } from "./new-booking-modal";
import { normalizeIranianMobile } from "./reservation-validation";
import type { Booking, NewBookingValues } from "./types";

import { toPersianDigits } from "@/utils/numbers.utils";

export default function DashboardPage() {
  const [bookings, setBookings] = useState(initialBookings);
  const [createOpen, setCreateOpen] = useState(false);

  function createBooking(values: NewBookingValues) {
    const newBooking: Booking = {
      id: Date.now(),
      customer: values.customer.trim(),
      phone: toPersianDigits(normalizeIranianMobile(values.phone)),
      service: values.service.trim(),
      date: values.date.calendar("gregory").format("YYYY-MM-DD"),
      time: toPersianDigits(dayjs(values.time).format("HH:mm")),
      status: "در انتظار تأیید",
    };
    setBookings((current) => [newBooking, ...current]);
    setCreateOpen(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title level={3} className="m-0! text-gray-900">
            داشبورد رزروها
          </Typography.Title>
          <Typography.Text className="mt-1 block text-gray-500">
            نمای کلی رزروها و برنامه‌ی پیشِ رو
          </Typography.Text>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          className="h-11 rounded-xl! shadow-sm"
          onClick={() => setCreateOpen(true)}
        >
          ثبت رزرو جدید
        </Button>
      </div>

      <BookingStats bookings={bookings} />
      <BookingTable bookings={bookings} />
      <NewBookingModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createBooking}
      />
    </div>
  );
}
