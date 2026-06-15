export function monthsDiffrence(monthStr1: string, monthStr2: string): number {
  // 1. Clean the strings by taking only the first 7 characters (YYYY-MM)
  const cleanStr1 = monthStr1.substring(0, 7); // '2026-05'
  const cleanStr2 = monthStr2.substring(0, 7); // '2026-06'

  // 2. Extract Year and Month as numbers
  const [year1, m1] = cleanStr1.split("-").map(Number);
  const [year2, m2] = cleanStr2.split("-").map(Number);

  // 3. Convert both to a total number of months
  const totalMonths1 = year1 * 12 + m1;
  const totalMonths2 = year2 * 12 + m2;

  // 4. Calculate the absolute difference
  const diffInMonths = Math.abs(totalMonths1 - totalMonths2);

  return diffInMonths;
}
