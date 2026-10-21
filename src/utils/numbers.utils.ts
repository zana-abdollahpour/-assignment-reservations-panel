const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const englishDigitMap: Record<string, string> = {
  ...Object.fromEntries([...persianDigits].map((digit, index) => [digit, String(index)])),
  ...Object.fromEntries(
    [..."٠١٢٣٤٥٦٧٨٩"].map(
      (digit, index) => [digit, String(index)],
    ),
  ),
};

export function toPersianDigits(value: string): string {
  return value.replace(/[0-9]/g, (digit) => persianDigits[Number(digit)]);
}

export function toEnglishDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => englishDigitMap[digit]);
}

export function formatPersianNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}
