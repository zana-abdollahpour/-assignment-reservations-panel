import express from "express";
import type { Request, Response } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  allowedStatuses,
  bookings,
  getTodayDate,
  nextBookingId,
  statusesByQuery,
} from "./data.ts";

type BookingPayload = Omit<(typeof bookings)[number], "id">;

const app = express();
const port = Number(process.env.API_PORT) || 3001;
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDirectory = path.resolve(serverDirectory, "../dist");

app.use(express.json());
app.use("/api", (_request, _response, next) => setTimeout(next, 2000));

function isValidBooking(body: unknown): body is BookingPayload {
  if (!body || typeof body !== "object") return false;
  const booking = body as Record<string, unknown>;
  return (
    typeof booking.customer === "string" &&
    typeof booking.phone === "string" &&
    /^[0-9\s()+-]+$/.test(booking.phone) &&
    typeof booking.service === "string" &&
    typeof booking.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(booking.date) &&
    typeof booking.time === "string" &&
    /^\d{2}:\d{2}$/.test(booking.time) &&
    typeof booking.status === "string" &&
    allowedStatuses.has(booking.status)
  );
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("fa-IR").replace(/\s/g, "");
}

app.get("/api/bookings/summary", (_request: Request, response: Response) => {
  response.json({
    total: bookings.length,
    today: bookings.filter((booking) => booking.date === getTodayDate()).length,
    confirmed: bookings.filter(
      (booking) => booking.status === statusesByQuery.confirmed,
    ).length,
    cancelled: bookings.filter(
      (booking) => booking.status === statusesByQuery.cancelled,
    ).length,
  });
});

app.get("/api/bookings", (request: Request, response: Response) => {
  const query = normalizeSearch(String(request.query.q ?? ""));
  const statusKey = String(request.query.status ?? "");
  const requestedStatus =
    Object.hasOwn(statusesByQuery, statusKey)
      ? statusesByQuery[statusKey as keyof typeof statusesByQuery]
      : undefined;
  const sortField = String(request.query.sort ?? "");
  const direction = request.query.order === "descend" ? -1 : 1;
  const page = Math.max(1, Number(request.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(request.query.pageSize) || 8));

  let results = bookings.filter((booking) => {
    const customer = normalizeSearch(booking.customer);
    const phone = normalizeSearch(booking.phone);
    const matchesQuery = !query || customer.includes(query) || phone.includes(query);
    return matchesQuery && (!requestedStatus || booking.status === requestedStatus);
  });

  if (sortField === "date") {
    results = [...results].sort(
      (a, b) => direction * (a.date.localeCompare(b.date) || a.time.localeCompare(b.time)),
    );
  } else if (sortField === "time") {
    results = [...results].sort(
      (a, b) => direction * (a.time.localeCompare(b.time) || a.date.localeCompare(b.date)),
    );
  } else if (sortField === "status") {
    const statusRank = new Map([
      [statusesByQuery.confirmed, 0],
      [statusesByQuery.pending, 1],
      [statusesByQuery.cancelled, 2],
    ]);
    results = [...results].sort(
      (a, b) => direction * ((statusRank.get(a.status) ?? 99) - (statusRank.get(b.status) ?? 99)),
    );
  }

  const total = results.length;
  const offset = (page - 1) * pageSize;
  response.json({ items: results.slice(offset, offset + pageSize), total, page, pageSize });
});

app.post("/api/bookings", (request: Request, response: Response) => {
  if (!isValidBooking(request.body)) {
    return response.status(400).json({ message: "اطلاعات رزرو معتبر نیست." });
  }

  const booking = { ...request.body, id: nextBookingId() };
  bookings.unshift(booking);
  return response.status(201).json(booking);
});

app.put("/api/bookings/:id", (request: Request, response: Response) => {
  const id = Number(request.params.id);
  const index = bookings.findIndex((booking) => booking.id === id);
  if (index === -1) {
    return response.status(404).json({ message: "رزرو پیدا نشد." });
  }
  if (!isValidBooking(request.body)) {
    return response.status(400).json({ message: "اطلاعات رزرو معتبر نیست." });
  }

  bookings[index] = { ...request.body, id };
  return response.json(bookings[index]);
});

app.delete("/api/bookings/:id", (request: Request, response: Response) => {
  const index = bookings.findIndex(
    (booking) => booking.id === Number(request.params.id),
  );
  if (index === -1) {
    return response.status(404).json({ message: "رزرو پیدا نشد." });
  }

  const [deletedBooking] = bookings.splice(index, 1);
  return response.json(deletedBooking);
});

app.use("/api", (_request: Request, response: Response) => {
  response.status(404).json({ message: "مسیر درخواستی پیدا نشد." });
});

app.use(express.static(frontendDirectory));
app.use((request: Request, response: Response, next) => {
  if (request.method === "GET" && request.accepts("html")) {
    return response.sendFile(path.join(frontendDirectory, "index.html"));
  }
  return next();
});

app.listen(port, () => {
  console.log(`Running on: http://localhost:${port}`);
});
