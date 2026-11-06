const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors';

export const BUTTON = {
  primary: `${base} bg-accent text-paper hover:bg-ink`,
  secondary: `${base} text-ink ring-1 ring-line hover:ring-ink`,
  onDark: `${base} bg-paper text-accent hover:bg-white`,
  onDarkOutline: `${base} text-paper ring-1 ring-paper/40 hover:ring-paper`,
};
