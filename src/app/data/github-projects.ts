import { Injectable, signal } from '@angular/core';

import type { Project } from '../models';
import { timeAgo } from '../utils/dates';
import { buildFilePaths, mergeTech, techFromFile } from '../utils/detect-tech';
import { PROJECTS } from './projects';

const GITHUB_USER = 'MirzaSuljic';

/** Repositories that are never listed automatically (this site, profile README, ...). */
const HIDDEN_REPOS = ['mirzasuljic.github.io', 'mirzasuljic', 'portfolio'];

/** How many cards get their latest commit message (one extra API request each). */
const MAX_COMMIT_LOOKUPS = 12;

const CACHE_KEY = 'github-projects-v3';
/** detected tech per repo, kept across visits (only read again after a new push) */
const TECH_CACHE_KEY = 'github-tech-v1';
/** check GitHub again after this many minutes (while the page is open, and when the tab is shown again) */
const REFRESH_MINUTES = 5;

export interface ShownProject extends Project {
  /** last push to GitHub (ISO date), when known */
  pushedAt?: string;
  /** "3 days ago" */
  updatedAgo?: string;
  lastCommit?: { message: string; url: string };
  /** true when the summary was not written by hand (no GitHub description either) */
  autoSummary?: boolean;
}

interface GithubRepo {
  name: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  private: boolean;
  pushed_at: string;
  default_branch: string;
}

interface GithubTree {
  tree: { path: string; type: string }[];
}

type TechCache = Record<string, { pushedAt: string; tech: string[] }>;

interface GithubCommit {
  html_url: string;
  commit: { message: string };
}

interface CacheEntry {
  at: number;
  projects: ShownProject[];
}

/**
 * The projects section's data: the hand-written list in projects.ts, updated with live data from
 * the public GitHub API (last push, latest commit) plus every other public repository, newest first.
 * Refreshes by itself every few minutes while the page is visible; commit messages are fetched again
 * only for repositories that changed, so a visitor stays well under GitHub's 60 requests an hour.
 * Without network (or when the rate limit is hit) the last known list stays.
 */
@Injectable({ providedIn: 'root' })
export class GithubProjects {
  readonly projects = signal<ShownProject[]>(PROJECTS);
  private started = false;
  private lastCheck = 0;
  private refreshing = false;

  /** Starts loading and the automatic refresh (once). */
  load() {
    if (this.started || typeof window === 'undefined') {
      return;
    }
    this.started = true;

    const cached = readCache();
    if (cached) {
      this.projects.set(withAgo(cached.projects));
      this.lastCheck = cached.at;
    }
    this.refreshIfStale();

    setInterval(() => this.refreshIfStale(), REFRESH_MINUTES * 60_000);
    document.addEventListener('visibilitychange', () => this.refreshIfStale());
  }

  private refreshIfStale() {
    const stale = Date.now() - this.lastCheck >= REFRESH_MINUTES * 60_000;
    if (!stale || this.refreshing || document.visibilityState !== 'visible') {
      return;
    }
    this.refreshing = true;
    this.refresh()
      .catch(() => {
        // keep what is shown
      })
      .finally(() => {
        this.refreshing = false;
        this.lastCheck = Date.now();
      });
  }

  private async refresh() {
    const repos = await getJson<GithubRepo[]>(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`
    );
    const previous = new Map(this.projects().map((p) => [p.repo, p]));
    const merged = merge(PROJECTS, repos);
    this.projects.set(withAgo(merged.map((p) => keepCommitIfUnchanged(p, previous.get(p.repo)))));

    // latest commit message for the first cards, only where something was pushed since last time
    const withCommits = await Promise.all(
      merged.map(async (project, index) => {
        const before = previous.get(project.repo);
        if (before?.lastCommit && before.pushedAt === project.pushedAt) {
          return { ...project, lastCommit: before.lastCommit };
        }
        if (index >= MAX_COMMIT_LOOKUPS) {
          return project;
        }
        try {
          const [latest] = await getJson<GithubCommit[]>(
            `https://api.github.com/repos/${GITHUB_USER}/${project.repo}/commits?per_page=1`
          );
          return latest
            ? { ...project, lastCommit: { message: firstLine(latest.commit.message), url: latest.html_url } }
            : project;
        } catch {
          return project;
        }
      })
    );
    this.projects.set(withAgo(withCommits));

    // what each project is built with, read from its package.json / pom.xml / build.gradle
    const branches = new Map(repos.map((r) => [r.name, r.default_branch]));
    const techCache = readTechCache();
    const withTech = await Promise.all(
      withCommits.map(async (project, index) => {
        const branch = branches.get(project.repo);
        if (!branch || !project.pushedAt) {
          return project;
        }
        let detected = techCache[project.repo]?.pushedAt === project.pushedAt ? techCache[project.repo].tech : null;
        if (!detected && index < MAX_COMMIT_LOOKUPS) {
          try {
            detected = await detectTech(project.repo, branch);
            techCache[project.repo] = { pushedAt: project.pushedAt, tech: detected };
          } catch {
            detected = null;
          }
        }
        return detected?.length ? applyTech(project, detected) : project;
      })
    );
    writeTechCache(techCache);
    this.projects.set(withAgo(withTech));
    writeCache(withTech);
  }
}

/** Reads the repository's build files (one API call for the file list, the files themselves from raw.githubusercontent.com). */
async function detectTech(repo: string, branch: string): Promise<string[]> {
  const tree = await getJson<GithubTree>(
    `https://api.github.com/repos/${GITHUB_USER}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`
  );
  const paths = buildFilePaths(tree.tree.filter((t) => t.type === 'blob').map((t) => t.path));
  const found = await Promise.all(
    paths.map(async (path) => {
      try {
        const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${repo}/${branch}/${path}`);
        return response.ok ? techFromFile(path, await response.text()) : [];
      } catch {
        return [];
      }
    })
  );
  return mergeTech(found.flat());
}

function applyTech(project: ShownProject, detected: string[]): ShownProject {
  const tech = mergeTech(detected, project.tech);
  return project.autoSummary ? { ...project, tech, summary: builtWith(detected) } : { ...project, tech };
}

/** "Built with Angular 22, TypeScript and Tailwind CSS." */
function builtWith(tech: string[]): string {
  const top = tech.slice(0, 3);
  const list = top.length > 1 ? `${top.slice(0, -1).join(', ')} and ${top[top.length - 1]}` : top[0];
  return `Built with ${list}.`;
}

function keepCommitIfUnchanged(project: ShownProject, before?: ShownProject): ShownProject {
  return before?.lastCommit && before.pushedAt === project.pushedAt ? { ...project, lastCommit: before.lastCommit } : project;
}

/** Hand-written projects keep their text; other public repos are added from their GitHub data. */
function merge(curated: Project[], repos: GithubRepo[]): ShownProject[] {
  const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
  const curatedNames = new Set(curated.map((p) => p.repo.toLowerCase()));

  const fromCurated: ShownProject[] = curated.map((project) => {
    const repo = byName.get(project.repo.toLowerCase());
    return repo
      ? { ...project, liveUrl: project.liveUrl ?? (repo.homepage || null), pushedAt: repo.pushed_at }
      : project;
  });

  const fromGithub: ShownProject[] = repos
    .filter(
      (r) =>
        !r.fork &&
        !r.archived &&
        !r.private &&
        !curatedNames.has(r.name.toLowerCase()) &&
        !HIDDEN_REPOS.includes(r.name.toLowerCase())
    )
    .map((r) => ({
      name: prettyName(r.name),
      repo: r.name,
      summary: r.description || (r.language ? `A ${r.language} project.` : 'A side project.'),
      autoSummary: !r.description,
      tech: r.topics?.length ? r.topics.slice(0, 5).map(prettyTopic) : r.language ? [r.language] : [],
      liveUrl: r.homepage || null,
      pushedAt: r.pushed_at,
    }));

  // newest first; projects GitHub knows nothing about stay at the end
  return [...fromCurated, ...fromGithub].sort(
    (a, b) => (b.pushedAt ? Date.parse(b.pushedAt) : 0) - (a.pushedAt ? Date.parse(a.pushedAt) : 0)
  );
}

function withAgo(projects: ShownProject[]): ShownProject[] {
  return projects.map((p) => (p.pushedAt ? { ...p, updatedAgo: timeAgo(p.pushedAt) } : p));
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) {
    throw new Error(`GitHub ${response.status}`);
  }
  return response.json() as Promise<T>;
}

const ACRONYMS = new Set(['jwt', 'api', 'db', 'ui', 'ux', 'crud', 'ib', 'cv', 'sql', 'css', 'html', 'js', 'ts', 'ai', 'id']);

/** "react-clothing-store" -> "React Clothing Store", "angular-jwt-login" -> "Angular JWT Login" */
function prettyName(repo: string): string {
  return repo
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => (ACRONYMS.has(word.toLowerCase()) ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)))
    .join(' ');
}

/** "spring-boot" -> "Spring Boot" */
function prettyTopic(topic: string): string {
  return topic
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function firstLine(message: string): string {
  const line = message.split('\n')[0].trim();
  return line.length > 72 ? line.slice(0, 71) + '…' : line;
}

/** Last result saved in this tab: shown at once on reload, checked again when older than REFRESH_MINUTES. */
function readCache(): CacheEntry | null {
  try {
    const entry = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null') as CacheEntry | null;
    return entry && Array.isArray(entry.projects) ? entry : null;
  } catch {
    return null;
  }
}

function writeCache(projects: ShownProject[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), projects } satisfies CacheEntry));
  } catch {
    // storage full or blocked: no cache
  }
}

function readTechCache(): TechCache {
  try {
    return (JSON.parse(localStorage.getItem(TECH_CACHE_KEY) ?? '{}') as TechCache) ?? {};
  } catch {
    return {};
  }
}

function writeTechCache(cache: TechCache) {
  try {
    localStorage.setItem(TECH_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // storage full or blocked
  }
}
