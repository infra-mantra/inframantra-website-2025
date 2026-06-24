/* ----------------------------------------------------------------
   Shared formatting + finance helpers for the calculator pages.
   Kept in one place so the EMI / Eligibility / Plan calculators all
   format money and compute instalments identically.
----------------------------------------------------------------- */

// Format a number into Indian-grouped rupees, e.g. 1234567 -> "₹12,34,567"
export function formatINR(value) {
  if (!isFinite(value)) return "₹0";
  return "₹" + Math.round(value).toLocaleString("en-IN");
}

// Short, readable label: ₹2.50 Cr / ₹75.00 Lakh
export function formatShort(value) {
  if (!isFinite(value) || value <= 0) return "₹0";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lakh`;
  return formatINR(value);
}

// Monthly EMI for a loan (same formula used across the property pages).
export function emiFor(principal, annualRate, years) {
  const p = Number(principal) || 0;
  const months = (Number(years) || 0) * 12;
  const monthlyRate = (Number(annualRate) || 0) / 12 / 100;
  if (p <= 0 || months <= 0) return 0;
  if (monthlyRate === 0) return p / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (p * monthlyRate * factor) / (factor - 1);
}

// Inverse of emiFor: the largest loan whose EMI fits a given monthly budget.
export function maxLoanForEmi(emi, annualRate, years) {
  const e = Number(emi) || 0;
  const months = (Number(years) || 0) * 12;
  const monthlyRate = (Number(annualRate) || 0) / 12 / 100;
  if (e <= 0 || months <= 0) return 0;
  if (monthlyRate === 0) return e * months;
  return (e * (1 - Math.pow(1 + monthlyRate, -months))) / monthlyRate;
}

// Strip everything but digits from a typed money field, clamp to [0, max].
export function sanitizeAmount(raw, max = Infinity) {
  const n = Number(String(raw).replace(/[^0-9]/g, ""));
  if (!isFinite(n)) return 0;
  return Math.min(Math.max(n, 0), max);
}
