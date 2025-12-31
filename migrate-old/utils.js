function generatePlaceholders(rowCount, columnsPerRow) {
  return Array.from({ length: rowCount }, (_, i) => {
    const offset = i * columnsPerRow;
    const placeholders = Array.from(
      { length: columnsPerRow },
      (_, j) => `$${offset + j + 1}`
    );
    return `(${placeholders.join(", ")})`;
  }).join(", ");
}

function formatDateSafe(input) {
  // If input is falsy, return null
  if (!input) return null;

  // If it's already a Date object
  if (input instanceof Date) {
    if (isNaN(input.getTime())) return null; // invalid date
    const yyyy = input.getFullYear();
    const mm = String(input.getMonth() + 1).padStart(2, "0");
    const dd = String(input.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  // Convert to string and clean whitespace
  const dateStr = String(input).trim();

  // Check if it's a valid pattern
  const parts = dateStr.split("-");
  if (parts.length !== 3) return null;

  let [day, month, year] = parts.map(p => parseInt(p, 10));

  // Validate numeric parts
  if (!day || !month || !year || day > 31 || month > 12) return null;

  // Handle 2-digit year (e.g., 25 → 2025)
  if (year < 100) {
    year += 2000;
  }

  // Pad zeros
  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  const yyyy = String(year);

  return `${yyyy}-${mm}-${dd}`;
}

function normalizeDate(dateStr) {
  if (!dateStr) return null;
  const d = dateStr.trim().replace(/\//g, "-");

  // Case 1: DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(d)) {
    const [day, month, year] = d.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // Case 2: YYYY-MM-DD (already correct)
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;

  // Otherwise, try JS Date fallback
  const parsed = new Date(d);
  if (!isNaN(parsed)) return parsed.toISOString().split("T")[0];

  return null;
}
module.exports = {
    generatePlaceholders,
    formatDateSafe,
    normalizeDate
}

