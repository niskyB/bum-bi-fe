export const vietnameseCurrencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

// Format number to Vietnamese currency string
export const formatToCurrency = (value: number | string): string => {
  const numValue = typeof value === "string" ? parseFloat(value) || 0 : value;
  return vietnameseCurrencyFormatter.format(numValue);
};

// Parse currency string back to number
export const parseCurrency = (value: string): number => {
  // Remove all non-numeric characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, "");
  return parseFloat(cleanValue) || 0;
};

// Format number with thousand separators (for display)
export const formatNumber = (value: number | string): string => {
  const numValue = typeof value === "string" ? parseFloat(value) || 0 : value;
  return new Intl.NumberFormat("vi-VN").format(numValue);
};
