"use client";
import { useEffect, useState } from "react";
import { loadJobs, saveJobs } from "@/lib/storage";
import { DiscoveredJob, JobStatus } from "@/lib/types";
import { PageWrap } from "@/components/ui";

const STATUSES: JobStatus[] = ["applied", "interviewing", "offer", "rejected", "withdrawn"];

const STATUS_META: Record<string, { color: string; label: string }> = {
  applied: { color: "#3b82f6", label: "Applied" },
  interviewing: { color: "#f59e0b", label: "Interviewing" },
  offer: { color: "#10b981", label: "Offer" },
  rejected: { color: "#ef4444", label: "Rejected" },
  withdrawn: { color: "#6b7280", label: "Withdrawn" },
};

export default function ApplicationsPage() {
  const [jobs, setJobs] = useState<DiscoveredJob[]>([]);
  const [filter, setFilter] = useState<JobStatus | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setJobs(loadJobs().filter((j) => ["applied", "interviewing", "offer", "rejected", "withdrawn"].includes(j.status)));
  }, []);

  function updateStatus(id: string, status: JobStatus) {
    const all = loadJobs();
    const updated = all.map((j) => (j.id === id ? { ...j, status } : j));
    saveJobs(updated);
    setJobs(updated.filter((j) => STATUSES.includes(j.status)));
  }

  const filtered = jobs
    .filter((j) => filter === "all" || j.status === filter)
    .filter((j) => {
      const q = search.toLowerCase();
      return !q || j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.appliedAt || b.discoveredAt).getTime() - new Date(a.appliedAt || a.discoveredAt).getTime());

  return (
    <PageWrap title="Applications" subtitle={`${jobs.length} total submitted`}>
      {/* Search + filter */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "0.45rem 0.75rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--muted)", color: "var(--foreground)", fontSize: "0.875rem", flex: "1 1 150px" }}
        />
        {(["all", ...STATUSES] as const).map((s) => {
          const meta = s !== "all" ? STATUS_META[s] : null;
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{ padding: "0.35rem 0.75rem", borderRadius: "9999px", border: `1px solid ${active ? (meta?.color ?? "var(--accent)") : "var(--border)"}`, background: active ? ((meta?.color ?? "var(--accent)") + "22") : "transparent", color: active ? (meta?.color ?? "var(--accent)") : "var(--muted-fg)", fontSize: "0.8rem", fontWeight: 500, cursor: "pointer" }}
            >
              {s === "all" ? "All" : meta?.label} {s !== "all" && `(${jobs.filter((j) => j.status === s).length})`}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted-fg)", border: "1px dashed var(--border)", borderRadius: "12px" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📭</div>
          <p>No applications here yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {filtered.map((job) => {
            const meta = STATUS_META[job.status];
            return (
              <div key={job.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderLeft: `3px solid ${meta?.color ?? "#6b7280"}`, borderRadius: "10px", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted-fg)", marginTop: "0.1rem" }}>
                    {job.company} · {job.location || "Remote"} · via {job.platform}
                    {job.salary && ` · ${job.salary}`}
                  </div>
                  {job.notes && <div style={{ fontSize: "0.78rem", color: "var(--muted-fg)", marginTop: "0.25rem", fontStyle: "italic" }}>{job.notes}</div>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0, flexWrap: "wrap" }}>
                  <select
                    value={job.status}
                    onChange={(e) => updateStatus(job.id, e.target.value as JobStatus)}
                    style={{ padding: "0.3rem 0.6rem", borderRadius: "8px", border: `1px solid ${meta?.color}`, background: (meta?.color ?? "#6b7280") + "18", color: meta?.color ?? "#6b7280", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s]?.label}</option>)}
                  </select>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted-fg)", whiteSpace: "nowrap" }}>
                    {job.appliedAt ? new Date(job.appliedAt).toLocaleDateString() : "—"}
                  </span>
                  {job.link && (
                    <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none" }}>↗</a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageWrap>
  );
}
