import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card, Statistic } from "antd";
import type { BookingSummary } from "./bookings-api";

import { formatPersianNumber } from "@/utils/numbers.utils";

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card
      className="rounded-2xl border-gray-100 shadow-sm"
      styles={{ body: { padding: 20 } }}
    >
      <Statistic
        title={title}
        value={value}
        formatter={(count) => formatPersianNumber(Number(count))}
        prefix={<span className={color}>{icon}</span>}
      />
    </Card>
  );
}

export function BookingStats({ summary }: { summary: BookingSummary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="کل رزروها" value={summary.total} icon={<TeamOutlined />} color="text-blue-600" />
      <StatCard title="رزروهای امروز" value={summary.today} icon={<CalendarOutlined />} color="text-violet-600" />
      <StatCard title="رزروهای تأییدشده" value={summary.confirmed} icon={<CheckCircleOutlined />} color="text-green-600" />
      <StatCard title="رزروهای لغوشده" value={summary.cancelled} icon={<CloseCircleOutlined />} color="text-red-500" />
    </div>
  );
}
