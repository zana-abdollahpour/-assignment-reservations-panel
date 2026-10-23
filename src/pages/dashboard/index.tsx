import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Alert, Button, Typography } from "antd";
import dayjs from "dayjs";
import "jalaliday";
import { useSearchParams } from "react-router";

import { BookingStats } from "./booking-stats";
import { BookingTable } from "./booking-table";
import { NewBookingModal } from "./new-booking-modal";
import { BookingDetailsModal } from "./booking-details-modal";
import { normalizeIranianMobile } from "@/utils/phone.utils";
import type { Booking, NewBookingValues } from "./types";
import type { BookingPayload } from "./bookings.api";
import {
  useBookingSummaryQuery,
  useBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
} from "./bookings.queries";

export default function DashboardPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const bookingsQuery = useBookingsQuery(queryString);
  const summaryQuery = useBookingSummaryQuery();
  const createMutation = useCreateBookingMutation();
  const updateMutation = useUpdateBookingMutation();

  async function createBooking(values: NewBookingValues) {
    const booking: BookingPayload = {
      customer: values.customer.trim(),
      phone: normalizeIranianMobile(values.phone),
      service: values.service.trim(),
      date: values.date.calendar("gregory").format("YYYY-MM-DD"),
      time: dayjs(values.time).format("HH:mm"),
      status: "در انتظار تأیید",
    };
    await createMutation.mutateAsync(booking);
    setCreateOpen(false);
  }

  async function updateBooking(
    id: number,
    values: NewBookingValues & { status: Booking["status"] },
  ) {
    const booking: BookingPayload = {
      customer: values.customer.trim(),
      phone: normalizeIranianMobile(values.phone),
      service: values.service.trim(),
      date: values.date.calendar("gregory").format("YYYY-MM-DD"),
      time: dayjs(values.time).format("HH:mm"),
      status: values.status,
    };
    await updateMutation.mutateAsync({ id, booking });
    setSelectedBooking(null);
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

      {summaryQuery.isError ? (
        <Alert
          type="error"
          showIcon
          message="دریافت آمار رزروها ناموفق بود."
          description={summaryQuery.error.message}
          action={
            <Button onClick={() => summaryQuery.refetch()}>تلاش دوباره</Button>
          }
        />
      ) : (
        <BookingStats
          summary={summaryQuery.data}
          loading={summaryQuery.isPending}
        />
      )}
      <BookingTable
        bookings={bookingsQuery.data?.items ?? []}
        total={bookingsQuery.data?.total ?? 0}
        loading={bookingsQuery.isPending || bookingsQuery.isFetching}
        error={bookingsQuery.error}
        onRetry={() => bookingsQuery.refetch()}
        onSelectBooking={setSelectedBooking}
      />
      <BookingDetailsModal
        booking={selectedBooking}
        loading={updateMutation.isPending}
        onClose={() => setSelectedBooking(null)}
        onSave={updateBooking}
      />
      <NewBookingModal
        open={createOpen}
        loading={createMutation.isPending}
        onClose={() => setCreateOpen(false)}
        onCreate={createBooking}
      />
    </div>
  );
}
