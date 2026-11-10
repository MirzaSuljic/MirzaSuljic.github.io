import { Injectable, signal } from '@angular/core';

import type { Project } from '../models';
import { timeAgo } from '../utils/dates';
import { PROJECTS } from './projects';

const GITHUB_USER = 'MirzaSuljic';

/** Repositories that are never listed automatically (this site, profile README, ...). */
const HIDDEN_REPOS = ['mirzasuljic.github.io', 'mirzasuljic', 'portfolio'];

/** How many cards get their latest commit message (one extra API request each). */
const MAX_COMMIT_LOOKUPS = 12;

const CACHE_KEY = 'github-projects-v1';
const CACHE_MINUTES = 30;

export interface ShownProject extends Project {
  /** last push to GitHub (ISO date), when known */
  pushedAt?: string;
  /** "3 days ago" */
  updatedAgo?: string;
  lastCommit?: { message: string; url: string };
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
}

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
 * Without network (or when GitHub's rate limit of 60 requests an hour is hit) the static list stays.
 */
@Injectable({ providedIn: 'root' })
export class GithubProjects {
  readonly projects = signal<ShownProject[]>(PROJECTS);
  private loaded = false;

  load() {
    if (this.loaded || typeof window === 'undefined') {
      return;
    }
    this.loaded = true;

    const cached = readCache();
    if (cached) {
      this.projects.set(withAgo(cached));
      return;
    }
    this.fetchAll().catch(() => {
      // keep the static list
    });
  }

  private async fetchAll() {
    const repos = await getJson<GithubRepo[]>(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`
    );
    const merged = merge(PROJECTS, repos);
    this.projects.set(withAgo(merged));

    // latest commit message for the first cards
    const withCommits = await Promise.all(
      merged.map(async (project, index) => {
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
    writeCache(withCommits);
  }
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

/** "react-clothing-store" -> "React Clothing Store", "angularMovieDB" -> "Angular Movie DB" */
function prettyName(repo: string): string {
  return repo
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
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

function readCache(): ShownProject[] | null {
  try {
    const entry = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null') as CacheEntry | null;
    return entry && Date.now() - entry.at < CACHE_MINUTES * 60_000 ? entry.projects : null;
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
