import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card, Statistic } from "antd";
import type { Booking } from "./types";
import { today } from "./mock-data";

const numberFormatter = new Intl.NumberFormat("fa-IR");

function StatCard({ title, value, icon, color }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="rounded-2xl border-gray-100 shadow-sm" styles={{ body: { padding: 20 } }}>
      <Statistic
        title={title}
        value={value}
        formatter={(count) => numberFormatter.format(Number(count))}
        prefix={<span className={color}>{icon}</span>}
      />
    </Card>
  );
}

export function BookingStats({ bookings }: { bookings: Booking[] }) {
  const confirmed = bookings.filter((booking) => booking.status === "تأییدشده").length;
  const cancelled = bookings.filter((booking) => booking.status === "لغوشده").length;
  const todaysBookings = bookings.filter((booking) => booking.date === today).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="کل رزروها" value={bookings.length} icon={<TeamOutlined />} color="text-blue-600" />
      <StatCard title="رزروهای امروز" value={todaysBookings} icon={<CalendarOutlined />} color="text-violet-600" />
      <StatCard title="رزروهای تأییدشده" value={confirmed} icon={<CheckCircleOutlined />} color="text-green-600" />
      <StatCard title="رزروهای لغوشده" value={cancelled} icon={<CloseCircleOutlined />} color="text-red-500" />
    </div>
  );
}
