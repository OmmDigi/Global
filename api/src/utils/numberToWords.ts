export function numberToWords(num: number): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
    "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
    "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];
  
  const scales = ["", "Thousand", "Lakh", "Crore"]; // if you want Indian system
  
  if (num === 0) return "Zero Only";

  function convertToWords(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + convertToWords(n % 100) : "");
    return "";
  }

  // Break into thousands, lakhs, crores
  let result = "";
  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = Math.floor((num % 1000) / 100);
  const rest = num % 100;

  if (crore) result += convertToWords(crore) + " Crore ";
  if (lakh) result += convertToWords(lakh) + " Lakh ";
  if (thousand) result += convertToWords(thousand) + " Thousand ";
  if (hundred) result += convertToWords(hundred) + " Hundred ";
  if (rest) result += convertToWords(rest) + " ";

  return result.trim() + " Only";
}