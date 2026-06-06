"use client";
import { AppConfig, DiscoveredJob, DEFAULT_CONFIG, RunStatus, DEFAULT_RUN_STATUS } from "./types";

const KEYS = {
  config: "co_config",
  jobs: "co_jobs",
  run: "co_run",
};

// ── Config ────────────────────────────────────────────────────────────────────
export function loadConfig(): AppConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(KEYS.config);
    if (!raw) return DEFAULT_CONFIG;
    const saved = JSON.parse(raw);
    return deepMerge(DEFAULT_CONFIG, saved) as AppConfig;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: AppConfig): void {
  localStorage.setItem(KEYS.config, JSON.stringify(config));
}

// ── Jobs ──────────────────────────────────────────────────────────────────────
export function loadJobs(): DiscoveredJob[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEYS.jobs);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveJobs(jobs: DiscoveredJob[]): void {
  localStorage.setItem(KEYS.jobs, JSON.stringify(jobs));
}

export function upsertJob(job: DiscoveredJob): void {
  const jobs = loadJobs();
  const idx = jobs.findIndex((j) => j.id === job.id);
  if (idx >= 0) jobs[idx] = job;
  else jobs.unshift(job);
  saveJobs(jobs);
}

// ── Run status ────────────────────────────────────────────────────────────────
export function loadRunStatus(): RunStatus {
  if (typeof window === "undefined") return DEFAULT_RUN_STATUS;
  try {
    const raw = localStorage.getItem(KEYS.run);
    return raw ? JSON.parse(raw) : DEFAULT_RUN_STATUS;
  } catch {
    return DEFAULT_RUN_STATUS;
  }
}

export function saveRunStatus(s: RunStatus): void {
  localStorage.setItem(KEYS.run, JSON.stringify(s));
}

// ── Export / Import ───────────────────────────────────────────────────────────
export function exportData(): string {
  return JSON.stringify({ config: loadConfig(), jobs: loadJobs() }, null, 2);
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.config) saveConfig(data.config);
    if (data.jobs) saveJobs(data.jobs);
    return true;
  } catch {
    return false;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function deepMerge(base: unknown, override: unknown): unknown {
  if (typeof base !== "object" || base === null) return override ?? base;
  if (typeof override !== "object" || override === null) return base;
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const key of Object.keys(override as Record<string, unknown>)) {
    result[key] = deepMerge(result[key], (override as Record<string, unknown>)[key]);
  }
  return result;
}
