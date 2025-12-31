// Function to create unique filename using date-time
export function generateUniqueFileName(prefix = "file", ext = "txt") {
  const now = new Date();
  const timestamp = now
    .toISOString() // e.g. 2025-10-11T09:51:33.456Z
    .replace(/[:.]/g, "-"); // replace invalid filename characters
  return `${prefix}_${timestamp}.${ext}`;
}
