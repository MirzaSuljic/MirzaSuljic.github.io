const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parse(month: string): { year: number; month: number } {
  const [year, m] = month.split('-').map(Number);
  return { year, month: m };
}

export function yearsSince(start: string, now = new Date()): number {
  const from = parse(start);
  const months = (now.getFullYear() - from.year) * 12 + (now.getMonth() + 1 - from.month);
  return Math.max(0, Math.floor(months / 12));
}

export function formatMonth(month: string): string {
  const { year, month: m } = parse(month);
  return `${MONTHS[m - 1]} ${year}`;
}

export function formatPeriod(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`;
}
