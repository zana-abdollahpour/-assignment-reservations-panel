import {
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Card, Skeleton, Statistic } from "antd";
import type { BookingSummary } from "./bookings.api";
import { formatPersianNumber } from "@/utils/numbers.utils";

function StatCard({
  title,
  value,
  icon,
  color,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  loading: boolean;
}) {
  return (
    <Card
      className="rounded-2xl border-gray-100 shadow-sm"
      styles={{ body: { padding: 20 } }}
    >
      {loading ? (
        <Skeleton active title={{ width: "55%" }} paragraph={false} />
      ) : (
        <Statistic
          title={title}
          value={value}
          formatter={(count) => formatPersianNumber(Number(count))}
          prefix={<span className={color}>{icon}</span>}
        />
      )}
    </Card>
  );
}

export function BookingStats({
  summary,
  loading,
}: {
  summary?: BookingSummary;
  loading: boolean;
}) {
  const values = summary ?? { total: 0, today: 0, confirmed: 0, cancelled: 0 };
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="کل رزروها"
        value={values.total}
        icon={<TeamOutlined />}
        color="text-blue-600"
        loading={loading}
      />
      <StatCard
        title="رزروهای امروز"
        value={values.today}
        icon={<CalendarOutlined />}
        color="text-violet-600"
        loading={loading}
      />
      <StatCard
        title="رزروهای تأییدشده"
        value={values.confirmed}
        icon={<CheckCircleOutlined />}
        color="text-green-600"
        loading={loading}
      />
      <StatCard
        title="رزروهای لغوشده"
        value={values.cancelled}
        icon={<CloseCircleOutlined />}
        color="text-red-500"
        loading={loading}
      />
    </div>
  );
}
