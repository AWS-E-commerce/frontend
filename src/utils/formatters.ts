export const formatCurrency = (amount: number, locale = "vi-VN"): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: locale === "vi-VN" ? "VND" : "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date, locale = "vi-VN"): string => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatShortDate = (
  date: string | Date,
  locale = "vi-VN",
): string => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export function toLocalDate(value: string): string {
  // Convert yyyy-MM-dd → dd/MM/yyyy
  if (!value) return "";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

export function formatDateToDDMMYYYY(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}
