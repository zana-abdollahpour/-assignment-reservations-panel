import dayjs, { type Dayjs } from "dayjs";
import { z } from "zod";
import type { RuleObject } from "antd/es/form";
import "jalaliday";

import { toEnglishDigits } from "@/utils/numbers.utils";

export function normalizeIranianMobile(value: string) {
  const normalized = toEnglishDigits(value).replace(/[\s()-]/g, "");

  if (normalized.startsWith("+98")) return `0${normalized.slice(3)}`;
  if (normalized.startsWith("0098")) return `0${normalized.slice(4)}`;
  if (normalized.startsWith("98") && normalized.length === 12) {
    return `0${normalized.slice(2)}`;
  }
  if (/^9\d{9}$/.test(normalized)) return `0${normalized}`;
  return normalized;
}

const customerSchema = z
  .string({ error: "نام مشتری را وارد کنید" })
  .trim()
  .min(1, "نام مشتری را وارد کنید")
  .min(2, "نام باید دست‌کم ۲ نویسه باشد")
  .max(60, "نام نمی‌تواند بیشتر از ۶۰ نویسه باشد")
  .regex(
    /^[\p{L}\p{M}]+(?:[\s\u200c'-][\p{L}\p{M}]+)*$/u,
    "نام را فقط با حروف و فاصله وارد کنید",
  );

const phoneSchema = z
  .string({ error: "شماره تماس را وارد کنید" })
  .trim()
  .min(1, "شماره تماس را وارد کنید")
  .refine(
    (value) => /^09\d{9}$/.test(normalizeIranianMobile(value)),
    "شماره موبایل معتبر ایران را وارد کنید",
  );

const serviceSchema = z
  .string({ error: "نوع خدمت را وارد کنید" })
  .trim()
  .min(1, "نوع خدمت را وارد کنید")
  .min(2, "نوع خدمت باید دست‌کم ۲ نویسه باشد")
  .max(80, "نوع خدمت نمی‌تواند بیشتر از ۸۰ نویسه باشد");

const dateSchema = z
  .custom<Dayjs>((value): value is Dayjs => dayjs.isDayjs(value), {
    message: "تاریخ را انتخاب کنید",
  })
  .refine(
    (date) =>
      date.calendar("gregory").startOf("day").valueOf() >=
      dayjs().calendar("gregory").startOf("day").valueOf(),
    "تاریخ رزرو نمی‌تواند در گذشته باشد",
  );

const timeSchema = z.custom<Dayjs>(
  (value): value is Dayjs => dayjs.isDayjs(value),
  {
    message: "ساعت را انتخاب کنید",
  },
);

export const reservationSchema = z.object({
  customer: customerSchema,
  phone: phoneSchema,
  service: serviceSchema,
  date: dateSchema,
  time: timeSchema,
});

export function zodFieldRule(schema: z.ZodType): RuleObject {
  return {
    validator: async (_rule: RuleObject, value: unknown): Promise<void> => {
      const result = schema.safeParse(value);
      if (!result.success) {
        throw new Error(
          result.error.issues[0]?.message ?? "مقدار واردشده معتبر نیست",
        );
      }
    },
  };
}
