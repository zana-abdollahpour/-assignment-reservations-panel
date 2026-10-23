type BookingStatus = string;

type Booking = {
  id: number;
  customer: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
};

type SeedData = {
  customers: string[];
  services: string[];
  statuses: BookingStatus[];
};

const seed: SeedData = {
  "customers": [
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
    "لیلا زارعی"
  ],
  "services": [
    "مشاوره پوست",
    "فیشیال صورت",
    "پاکسازی پوست",
    "ماساژ ریلکسی",
    "میکرونیدلینگ"
  ],
  "statuses": [
    "تأییدشده",
    "تأییدشده",
    "در انتظار تأیید",
    "تأییدشده",
    "لغوشده"
  ]
};

function dateForOffset(offset: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const bookings: Booking[] = seed.customers.map((customer, index) => {
  const time = `${String(9 + (index % 9)).padStart(2, "0")}:${index % 2 === 0 ? "00" : "30"}`;
  return {
    id: index + 1,
    customer,
    phone: `09${12 + (index % 8)} ${String(100 + index * 17).slice(-3)} ${String(1000 + index * 37).slice(-4)}`,
    service: seed.services[index % seed.services.length],
    date: dateForOffset((index % 11) - 3),
    time,
    status: seed.statuses[index % seed.statuses.length],
  };
});

export const allowedStatuses = new Set(seed.statuses);
export const statusesByQuery = {
  confirmed: seed.statuses[0],
  pending: seed.statuses[2],
  cancelled: seed.statuses[4],
};

export function getTodayDate() {
  return dateForOffset(0);
}

export function nextBookingId() {
  return bookings.reduce((maxId, booking) => Math.max(maxId, booking.id), 0) + 1;
}
