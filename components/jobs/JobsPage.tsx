"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadJobs, saveJobs } from "@/lib/storage";
import { DiscoveredJob, JobStatus } from "@/lib/types";
import { PageWrap, Btn } from "@/components/ui";

const STATUSES: JobStatus[] = ["discovered", "scored", "approved", "applied", "interviewing", "offer", "rejected", "withdrawn", "skipped"];

const STATUS_COLORS: Partial<Record<JobStatus, string>> = {
  discovered: "#6366f1",
  scored: "#8b5cf6",
  approved: "#06b6d4",
  skipped: "#6b7280",
  applying: "#f59e0b",
  applied: "#3b82f6",
  interviewing: "#f59e0b",
  offer: "#10b981",
  rejected: "#ef4444",
  withdrawn: "#6b7280",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<DiscoveredJob[]>([]);
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setJobs(loadJobs());
  }, []);

  function deleteJob(id: string) {
    if (!confirm("Delete this application?")) return;
    const updated = jobs.filter((j) => j.id !== id);
    saveJobs(updated);
    setJobs(updated);
  }

  function updateStatus(id: string, status: JobStatus) {
    const updated = jobs.map((j) => (j.id === id ? { ...j, status } : j));
    saveJobs(updated);
    setJobs(updated);
  }

  const filtered = jobs
    .filter((j) => filter === "all" || j.status === filter)
    .filter((j) => {
      const q = search.toLowerCase();
      return !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.appliedAt || b.discoveredAt).getTime() - new Date(a.appliedAt || a.discoveredAt).getTime());

  return (
    <PageWrap
      title="Job Tracker"
      subtitle={`${jobs.length} total applications`}
      action={
        <Link
          href="/jobs/new"
          style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "var(--accent)", color: "white", textDecoration: "none", fontSize: "0.875rem", fontWeight: 600 }}
        >
          + Add Application
        </Link>
      }
    >
      {/* Filters */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
        <input
          placeholder="Search title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "0.45rem 0.75rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--muted)", color: "var(--foreground)", fontSize: "0.875rem", flex: "1 1 180px", minWidth: "150px" }}
        />
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "0.35rem 0.75rem",
                borderRadius: "9999px",
                border: "1px solid " + (filter === s ? (s === "all" ? "var(--accent)" : STATUS_COLORS[s]) : "var(--border)"),
                background: filter === s ? (s === "all" ? "var(--accent)" : STATUS_COLORS[s] + "22") : "transparent",
                color: filter === s ? (s === "all" ? "white" : STATUS_COLORS[s]) : "var(--muted-fg)",
                fontSize: "0.8rem",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && (
                <span style={{ marginLeft: "0.35rem", opacity: 0.7 }}>
                  {jobs.filter((j) => j.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted-fg)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📭</div>
          <p style={{ fontWeight: 500 }}>No applications found</p>
          <Link href="/jobs/new" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "0.875rem", marginTop: "0.5rem", display: "inline-block" }}>
            Add your first application →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filtered.map((job) => (
            <div
              key={job.id}
              style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/jobs/${job.id}`} style={{ textDecoration: "none", color: "var(--foreground)" }}>
                  <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--muted-fg)", marginTop: "0.1rem" }}>
                    {job.company} {job.location && `· ${job.location}`} {job.salary && `· ${job.salary}`}
                  </div>
                </Link>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0, flexWrap: "wrap" }}>
                <select
                  value={job.status}
                  onChange={(e) => updateStatus(job.id, e.target.value as JobStatus)}
                  style={{ padding: "0.3rem 0.6rem", borderRadius: "8px", border: "1px solid " + STATUS_COLORS[job.status], background: STATUS_COLORS[job.status] + "18", color: STATUS_COLORS[job.status], fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <span style={{ fontSize: "0.75rem", color: "var(--muted-fg)", whiteSpace: "nowrap" }}>
                  {new Date(job.appliedAt || job.discoveredAt).toLocaleDateString()}
                </span>
                {job.link && (
                  <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none" }}>
                    ↗ Link
                  </a>
                )}
                <button onClick={() => deleteJob(job.id)} style={{ background: "none", border: "none", color: "var(--muted-fg)", cursor: "pointer", fontSize: "1rem", lineHeight: 1 }}>
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageWrap>
  );
}
