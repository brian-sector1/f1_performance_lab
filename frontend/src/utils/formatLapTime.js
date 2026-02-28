/**
 * Parse lap time string to seconds for sorting (e.g. "0 days 00:01:17.329000" -> 77.329).
 * Returns Infinity for null/empty so missing times sort last.
 */
export function parseLapTimeToSeconds(value) {
  if (value == null || value === '') return Infinity;
  const str = String(value).trim();
  if (!str) return Infinity;
  if (str.includes('days') || (str.includes(':') && str.includes('.'))) {
    const withoutDays = str.replace(/^\s*0\s+days\s+/, '').trim();
    const parts = withoutDays.split(':');
    if (parts.length >= 3) {
      const h = parseInt(parts[0], 10) || 0;
      const m = parseInt(parts[1], 10) || 0;
      const s = parseFloat(parts[2]) || 0;
      return h * 3600 + m * 60 + s;
    }
  }
  return Infinity;
}

/**
 * Format API lap time for display (e.g. "0 days 00:01:17.329000" -> "1:17.329").
 * F1 laps are under 5 minutes, so we show M:SS.mmm.
 */
export function formatLapTime(value) {
  if (value == null || value === '') return null;
  const str = String(value).trim();
  if (!str) return null;
  // Parse "0 days 00:01:17.329000" or similar
  if (str.includes('days') || (str.includes(':') && str.includes('.'))) {
    const withoutDays = str.replace(/^\s*0\s+days\s+/, '').trim();
    const parts = withoutDays.split(':');
    if (parts.length >= 3) {
      const h = parseInt(parts[0], 10) || 0;
      const m = parseInt(parts[1], 10) || 0;
      const s = parseFloat(parts[2]) || 0;
      const totalSec = h * 3600 + m * 60 + s;
      const mins = Math.floor(totalSec / 60);
      const secs = (totalSec % 60).toFixed(3);
      return `${mins}:${secs}`;
    }
  }
  return str;
}
