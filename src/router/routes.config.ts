import { generatePath, matchPath } from "react-router";

type RouteConfig = {
  path: string;
  title: string;
  end?: boolean;
};

export const routes = {
  home: {
    path: "/",
    title: "خانه",
    end: true,
  },
  dashboard: {
    path: "/dashboard",
    title: "داشبورد",
  },
  bookings: {
    path: "/bookings",
    title: "رزروها",
    new: {
      path: "/bookings/new",
      title: "رزرو جدید",
    },
    detail: {
      path: "/bookings/:bookingId",
      title: "جزئیات رزرو",
      to: (bookingId: string) =>
        generatePath(routes.bookings.detail.path, { bookingId }),
    },
  },
  customers: {
    path: "/customers",
    title: "مشتریان",
    detail: {
      path: "/customers/:customerId",
      title: "جزئیات مشتری",
      to: (customerId: string) =>
        generatePath(routes.customers.detail.path, { customerId }),
    },
  },
  settings: {
    path: "/settings",
    title: "تنظیمات",
  },
} as const;

function collectPageRoutes(value: unknown): RouteConfig[] {
  if (Array.isArray(value)) {
    return value.flatMap(collectPageRoutes);
  }

  if (typeof value !== "object" || value === null) {
    return [];
  }

  const entry = value as Record<string, unknown>;
  const currentRoute =
    typeof entry.path === "string" && typeof entry.title === "string"
      ? [{
          path: entry.path,
          title: entry.title,
          ...(typeof entry.end === "boolean" ? { end: entry.end } : {}),
        }]
      : [];

  return [
    ...currentRoute,
    ...Object.values(entry).flatMap(collectPageRoutes),
  ];
}

const pageRoutes = collectPageRoutes(routes);

export function getPageTitle(pathname: string): string {
  const matches = pageRoutes
    .filter((route) =>
      matchPath({ path: route.path, end: route.end ?? true }, pathname),
    )
    .sort(
      (a, b) =>
        b.path.split("/").filter(Boolean).length -
        a.path.split("/").filter(Boolean).length,
    );

  return matches[0]?.title ?? "صفحه پیدا نشد";
}

