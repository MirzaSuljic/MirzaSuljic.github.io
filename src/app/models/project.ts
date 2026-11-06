export interface Project {
  name: string;
  repo: string;
  summary: string;
  tech: string[];
  liveUrl: string | null;
  inProgress?: boolean;
}
