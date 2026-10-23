import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, notification, Typography } from "antd";
import dayjs from "dayjs";
import "jalaliday";
import { useSearchParams } from "react-router";

import { BookingStats } from "./booking-stats";
import { BookingTable } from "./booking-table";
import { NewBookingModal } from "./new-booking-modal";
import { BookingDetailsModal } from "./booking-details-modal";
import { normalizeIranianMobile } from "@/utils/phone.utils";
import type { Booking, NewBookingValues } from "./types";
import {
  bookingsApi,
  type BookingPayload,
  type BookingSummary,
} from "./bookings-api";

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<BookingSummary>({
    total: 0,
    today: 0,
    confirmed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    let active = true;
    setLoading(true);
    bookingsApi
      .list(queryString)
      .then((page) => {
        if (active) {
          setBookings(page.items);
          setTotal(page.total);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          notification.error({
            message:
              error instanceof Error
                ? error.message
                : "دریافت رزروها ناموفق بود.",
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [queryString, refreshKey]);

  useEffect(() => {
    let active = true;
    bookingsApi
      .summary()
      .then((nextSummary) => {
        if (active) setSummary(nextSummary);
      })
      .catch((error: unknown) => {
        if (active) {
          notification.error({
            message:
              error instanceof Error
                ? error.message
                : "دریافت آمار رزروها ناموفق بود.",
          });
        }
      });
    return () => {
      active = false;
    };
  }, [refreshKey]);

  async function createBooking(values: NewBookingValues) {
    const newBooking: BookingPayload = {
      customer: values.customer.trim(),
      phone: normalizeIranianMobile(values.phone),
      service: values.service.trim(),
      date: values.date.calendar("gregory").format("YYYY-MM-DD"),
      time: dayjs(values.time).format("HH:mm"),
      status: "در انتظار تأیید",
    };
    setSaving(true);
    try {
      await bookingsApi.create(newBooking);
      setRefreshKey((current) => current + 1);
      setCreateOpen(false);
    } catch (error) {
      notification.error({
        message:
          error instanceof Error ? error.message : "ثبت رزرو ناموفق بود.",
      });
      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function updateBooking(
    id: number,
    values: NewBookingValues & { status: Booking["status"] },
  ) {
    const updatedBooking: BookingPayload = {
      customer: values.customer.trim(),
      phone: normalizeIranianMobile(values.phone),
      service: values.service.trim(),
      date: values.date.calendar("gregory").format("YYYY-MM-DD"),
      time: dayjs(values.time).format("HH:mm"),
      status: values.status,
    };
    setSaving(true);
    try {
      await bookingsApi.update(id, updatedBooking);
      setRefreshKey((current) => current + 1);
      setSelectedBooking(null);
    } catch (error) {
      notification.error({
        message:
          error instanceof Error ? error.message : "ویرایش رزرو ناموفق بود.",
      });
      throw error;
    } finally {
      setSaving(false);
    }
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

      <BookingStats summary={summary} />
      <BookingTable
        bookings={bookings}
        total={total}
        loading={loading}
        onSelectBooking={setSelectedBooking}
      />
      <BookingDetailsModal
        booking={selectedBooking}
        loading={saving}
        onClose={() => setSelectedBooking(null)}
        onSave={updateBooking}
      />
      <NewBookingModal
        open={createOpen}
        loading={saving}
        onClose={() => setCreateOpen(false)}
        onCreate={createBooking}
      />
    </div>
  );
}
