import dayjs from "dayjs";
import jalaliday from "jalaliday";

import { toPersianDigits } from "@/utils/numbers.utils";
import type { Booking, BookingStatus } from "./types";

dayjs.extend(jalaliday);

const customers = [
  "نگار احمدی",
  "علی رضایی",
  "سارا محمدی",
  "مریم کریمی",
  "رضا موسوی",
  "الهام حسینی",
  "آرمان صادقی",
  "نیلوفر مرادی",
  "امیرحسین جعفری",
  "ترانه کاظمی",
  "نازنین رحیمی",
  "محمد امینی",
  "بهاره نوری",
  "پارسا حیدری",
  "آیدا شریفی",
  "کیان عباسی",
  "مهسا رستمی",
  "سامان یوسفی",
  "هستی قاسمی",
  "پویا اکبری",
  "غزل محمودی",
  "اشکان صالحی",
  "ریحانه نادری",
  "بردیا فلاح",
  "دنیا میرزایی",
  "سپهر حبیبی",
  "شیما باقری",
  "یاسمن سلطانی",
  "فرزاد مرادی",
  "پریناز شمس",
  "پدرام تهرانی",
  "مونا اسدی",
  "مانی شاکری",
  "فرشته رفیعی",
  "سینا نوروزی",
  "آوا قنبری",
  "بهنام ملکی",
  "روژان آذری",
  "کیارش توکلی",
  "لیلا زارعی",
];

const services = [
  "مشاوره پوست",
  "فیشیال صورت",
  "پاکسازی پوست",
  "ماساژ ریلکسی",
  "میکرونیدلینگ",
];
const statuses: BookingStatus[] = [
  "تأییدشده",
  "تأییدشده",
  "در انتظار تأیید",
  "تأییدشده",
  "لغوشده",
];

export const initialBookings: Booking[] = customers.map((customer, index) => {
  const dateOffset = (index % 11) - 3;
  const time = `${String(9 + (index % 9)).padStart(2, "0")}:${index % 2 === 0 ? "00" : "30"}`;

  return {
    id: index + 1,
    customer,
    phone: toPersianDigits(
      `09${12 + (index % 8)} ${String(100 + index * 17).slice(-3)} ${String(1000 + index * 37).slice(-4)}`,
    ),
    service: services[index % services.length],
    date: dayjs()
      .calendar("gregory")
      .add(dateOffset, "day")
      .format("YYYY-MM-DD"),
    time: toPersianDigits(time),
    status: statuses[index % statuses.length],
  };
});

export const today = dayjs().calendar("gregory").format("YYYY-MM-DD");
