export interface Job {
  company: string;
  role: string;
  start: string;
  end: string | null;
  location: string;
  highlights: string[];
  tech: string[];
}
