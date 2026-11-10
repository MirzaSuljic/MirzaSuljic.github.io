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

/** "today", "yesterday", "3 days ago", "2 weeks ago", "5 months ago", "1 year ago" */
export function timeAgo(iso: string, now = new Date()): string {
  const days = Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000));
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 14) return `${days} days ago`;
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  const years = Math.floor(days / 365);
  return years === 1 ? '1 year ago' : `${years} years ago`;
}
