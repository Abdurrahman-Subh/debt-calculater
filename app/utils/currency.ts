/**
 * Formats a number or string as Turkish Lira currency
 * @param amount - The amount to format (number or string)
 * @param includeCurrency - Whether to include the TL symbol
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | string,
  includeCurrency = false
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount || 0);

  return includeCurrency ? `${formatted} ₺` : formatted;
}
