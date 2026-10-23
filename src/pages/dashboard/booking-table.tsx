import { useState } from "react";
import { useSearchParams } from "react-router";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Empty,
  Input,
  Select,
  Table,
  Tag,
  Typography,
} from "antd";
import type { TableColumnsType } from "antd";
import type { HTMLAttributes, PointerEvent as ReactPointerEvent } from "react";

import { BookingStatusQuery, type Booking, type BookingStatus } from "./types";
import { formatPersianNumber, toPersianDigits } from "@/utils/numbers.utils";

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
const statusColors: Record<BookingStatus, string> = {
  تأییدشده: "success",
  "در انتظار تأیید": "warning",
  لغوشده: "error",
};
type ResizableHeaderProps = HTMLAttributes<HTMLTableCellElement> & {
  width?: number;
  onResizeColumn?: (width: number) => void;
};

function ResizableHeaderCell({
  children,
  onResizeColumn,
  style,
  width,
  ...props
}: ResizableHeaderProps) {
  function startResize(event: ReactPointerEvent<HTMLSpanElement>) {
    if (!onResizeColumn) return;
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startWidth =
      width ??
      event.currentTarget.parentElement?.getBoundingClientRect().width ??
      160;
    const isRtl = getComputedStyle(event.currentTarget).direction === "rtl";
    const handleMove = (moveEvent: PointerEvent) => {
      const delta = isRtl
        ? startX - moveEvent.clientX
        : moveEvent.clientX - startX;
      onResizeColumn(Math.max(90, Math.round(startWidth + delta)));
    };
    const stopResize = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);
  }

  return (
    <th
      {...props}
      style={{ ...style, position: "relative", width, minWidth: width }}
    >
      {children}
      {onResizeColumn && (
        <span
          aria-label="تغییر اندازه ستون"
          role="separator"
          aria-orientation="vertical"
          tabIndex={0}
          onPointerDown={startResize}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              onResizeColumn?.(
                Math.max(
                  90,
                  (width ?? 160) + (event.key === "ArrowRight" ? 16 : -16),
                ),
              );
            }
          }}
          className="absolute inset-y-0 inset-e-0 z-10 w-2 cursor-col-resize touch-none hover:bg-blue-200/70 focus-visible:bg-blue-300"
        />
      )}
    </th>
  );
}

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00`));
}

export function BookingTable({
  bookings,
  total,
  loading,
  onSelectBooking,
}: {
  bookings: Booking[];
  total: number;
  loading: boolean;
  onSelectBooking: (booking: Booking) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") ?? "";
  const requestedStatus = searchParams.get("status");
  const isStatusQuery = Object.values(BookingStatusQuery).some(
    (value) => value === requestedStatus,
  );
  const statusFilterKey: BookingStatusQuery | "all" = isStatusQuery
    ? (requestedStatus as BookingStatusQuery)
    : "all";
  const requestedSort = searchParams.get("sort");
  const sortField =
    requestedSort === "date" ||
    requestedSort === "time" ||
    requestedSort === "status"
      ? requestedSort
      : null;
  const sortOrder =
    searchParams.get("order") === "descend" ? "descend" : "ascend";
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const [columnWidths, setColumnWidths] = useState({
    customer: 220,
    service: 180,
    date: 160,
    time: 120,
    status: 170,
  });

  function resizeColumn(key: keyof typeof columnWidths, width: number) {
    setColumnWidths((current) => ({ ...current, [key]: width }));
  }

  function updateParams(
    updates: Record<string, string | null>,
    replace = false,
  ) {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "") nextParams.delete(key);
      else nextParams.set(key, value);
    });
    setSearchParams(nextParams, { replace });
  }

  const columns: TableColumnsType<Booking> = [
    {
      title: "مشتری",
      dataIndex: "customer",
      key: "customer",
      width: columnWidths.customer,
      onHeaderCell: () =>
        ({
          width: columnWidths.customer,
          onResizeColumn: (width: number) => resizeColumn("customer", width),
        }) as HTMLAttributes<HTMLTableCellElement>,
      render: (name: string, booking) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-gray-800">{name}</span>
          <span className="text-xs text-gray-500">{toPersianDigits(booking.phone)}</span>
        </div>
      ),
    },
    {
      title: "نوع خدمت",
      dataIndex: "service",
      key: "service",
      width: columnWidths.service,
      onHeaderCell: () =>
        ({
          width: columnWidths.service,
          onResizeColumn: (width: number) => resizeColumn("service", width),
        }) as HTMLAttributes<HTMLTableCellElement>,
    },
    {
      title: "تاریخ",
      dataIndex: "date",
      key: "date",
      sortOrder: sortField === "date" ? sortOrder : null,
      width: columnWidths.date,
      onHeaderCell: () =>
        ({
          width: columnWidths.date,
          onResizeColumn: (width: number) => resizeColumn("date", width),
        }) as HTMLAttributes<HTMLTableCellElement>,
      sorter: true,
      render: (date: string) => formatDate(date),
    },
    {
      title: "ساعت",
      dataIndex: "time",
      key: "time",
      sortOrder: sortField === "time" ? sortOrder : null,
      width: columnWidths.time,
      onHeaderCell: () =>
        ({
          width: columnWidths.time,
          onResizeColumn: (width: number) => resizeColumn("time", width),
        }) as HTMLAttributes<HTMLTableCellElement>,
      sorter: true,
      render: (time: string) => <span dir="ltr">{toPersianDigits(time)}</span>,
    },
    {
      title: "وضعیت",
      dataIndex: "status",
      key: "status",
      sortOrder: sortField === "status" ? sortOrder : null,
      sorter: true,
      width: columnWidths.status,
      onHeaderCell: () =>
        ({
          width: columnWidths.status,
          onResizeColumn: (width: number) => resizeColumn("status", width),
        }) as HTMLAttributes<HTMLTableCellElement>,
      render: (status: BookingStatus) => (
        <Tag
          color={statusColors[status]}
          className="m-0 rounded-full px-3 py-1"
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "\u062c\u0632\u0626\u06cc\u0627\u062a",
      key: "details",
      width: 110,
      render: (_value, booking) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={(event) => {
            event.stopPropagation();
            onSelectBooking(booking);
          }}
        >
          {"\u0628\u0631\u0631\u0633\u06cc"}
        </Button>
      ),
    },
  ];

  return (
    <Card
      className="overflow-hidden rounded-2xl border-gray-100 shadow-sm"
      styles={{ body: { padding: 0 } }}
    >
      <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Typography.Title level={5} className="m-0!">
            فهرست رزروها
          </Typography.Title>
          <Typography.Text className="mt-1 block text-sm text-gray-500">
            {formatPersianNumber(total)} رزرو
          </Typography.Text>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Input
            allowClear
            value={search}
            onChange={(event) =>
              updateParams({ q: event.target.value, page: "1" }, true)
            }
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="جست‌وجوی نام یا شماره تماس"
            className="h-10 rounded-xl sm:w-72"
          />
          <Select
            value={statusFilterKey}
            onChange={(value) =>
              updateParams({
                status: value === "all" ? null : value,
                page: "1",
              })
            }
            className="h-10 min-w-44"
            options={[
              { value: "all", label: "همه وضعیت‌ها" },
              { value: BookingStatusQuery.Confirmed, label: "تأییدشده" },
              { value: BookingStatusQuery.Pending, label: "در انتظار تأیید" },
              { value: BookingStatusQuery.Cancelled, label: "لغوشده" },
            ]}
          />
        </div>
      </div>
      <Table<Booking>
        loading={loading}
        rowKey="id"
        columns={columns}
        dataSource={bookings}
        locale={{
          emptyText: <Empty description="رزروی با این مشخصات پیدا نشد" />,
        }}
        pagination={{
          pageSize: 8,
          current: currentPage,
          total,
          showSizeChanger: false,
          position: ["bottomRight"],
          showTotal: (count) => `${formatPersianNumber(count)} رزرو`,
        }}
        scroll={{
          x: Object.values(columnWidths).reduce(
            (total, width) => total + width,
            0,
          ),
        }}
        tableLayout="fixed"
        components={{ header: { cell: ResizableHeaderCell } }}
        className="dashboard-bookings-table"
        onRow={(booking) => ({
          onClick: () => onSelectBooking(booking),
          className: "cursor-pointer",
        })}
        onChange={(pagination, _filters, sorter) => {
          const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter;
          const nextSortField = activeSorter?.columnKey;
          const hasSortableField =
            nextSortField === "date" ||
            nextSortField === "time" ||
            nextSortField === "status";
          updateParams({
            page: String(pagination.current ?? 1),
            sort:
              activeSorter?.order && hasSortableField ? nextSortField : null,
            order: activeSorter?.order ?? null,
          });
        }}
      />
    </Card>
  );
}
