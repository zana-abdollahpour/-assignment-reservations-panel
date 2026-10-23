import { toEnglishDigits } from "./numbers.utils";

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
