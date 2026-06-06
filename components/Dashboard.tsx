"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { loadJobs, loadConfig, loadRunStatus, exportData } from "@/lib/storage";
import { DiscoveredJob, RunStatus } from "@/lib/types";

const STAGE_COLORS: Record<string, string> = {
  idle: "#6b7280",
  discovering: "#6366f1",
  scoring: "#f59e0b",
  applying: "#3b82f6",
  done: "#10b981",
  error: "#ef4444",
};

function Stat({ n, label, color }: { n: number; label: string; color: string }) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem 1.5rem" }}>
      <div style={{ fontSize: "1.9rem", fontWeight: 800, color }}>{n}</div>
      <div style={{ fontSize: "0.78rem", color: "var(--muted-fg)", fontWeight: 500, marginTop: "0.15rem" }}>{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<DiscoveredJob[]>([]);
  const [run, setRun] = useState<RunStatus | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    setJobs(loadJobs());
    setRun(loadRunStatus());
    const cfg = loadConfig();
    setName(cfg.personal.firstName);
  }, []);

  const stats = {
    total: jobs.length,
    approved: jobs.filter((j) => ["applied", "interviewing", "offer"].includes(j.status)).length,
    interviewing: jobs.filter((j) => j.status === "interviewing").length,
    offers: jobs.filter((j) => j.status === "offer").length,
    pending: jobs.filter((j) => j.status === "approved").length,
  };

  const recent = [...jobs]
    .filter((j) => j.appliedAt)
    .sort((a, b) => new Date(b.appliedAt!).getTime() - new Date(a.appliedAt!).getTime())
    .slice(0, 5);

  function handleExport() {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "careerops-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            {name ? `Hey ${name} 👋` : "CareerOps Dashboard"}
          </h1>
          <p style={{ color: "var(--muted-fg)", marginTop: "0.25rem", fontSize: "0.9rem" }}>
            Multi-platform job application command center
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button onClick={handleExport} style={{ padding: "0.5rem 0.9rem", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--card)", color: "var(--foreground)", fontSize: "0.82rem", cursor: "pointer", fontWeight: 500 }}>
            Export
          </button>
          <Link href="/apply" style={{ padding: "0.5rem 1rem", borderRadius: "8px", background: "var(--accent)", color: "white", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 }}>
            🚀 Start Applying
          </Link>
        </div>
      </div>

      {/* Bot status banner */}
      {run && run.stage !== "idle" && (
        <div style={{ background: STAGE_COLORS[run.stage] + "18", border: `1px solid ${STAGE_COLORS[run.stage]}44`, borderRadius: "10px", padding: "0.875rem 1.25rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "1.1rem" }}>
            {run.stage === "discovering" ? "🔍" : run.stage === "scoring" ? "🤖" : run.stage === "applying" ? "⚡" : run.stage === "done" ? "✅" : "❌"}
          </span>
          <div>
            <strong style={{ color: STAGE_COLORS[run.stage] }}>{run.stage.toUpperCase()}</strong>{" "}
            <span style={{ color: "var(--foreground)", fontSize: "0.9rem" }}>{run.message}</span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "1rem", fontSize: "0.8rem", color: "var(--muted-fg)" }}>
            <span>Found: <strong>{run.discovered}</strong></span>
            <span>Applied: <strong>{run.applied}</strong></span>
            <span>Skipped: <strong>{run.skipped}</strong></span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.875rem", marginBottom: "2rem" }}>
        <Stat n={stats.total} label="Total Tracked" color="var(--foreground)" />
        <Stat n={stats.approved} label="Applied" color="#3b82f6" />
        <Stat n={stats.pending} label="Pending Apply" color="#f59e0b" />
        <Stat n={stats.interviewing} label="Interviewing" color="#6366f1" />
        <Stat n={stats.offers} label="Offers" color="#10b981" />
      </div>

      {/* Pipeline quick actions */}
      <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.875rem" }}>Pipeline</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0.875rem", marginBottom: "2rem" }}>
        {[
          { href: "/discover", icon: "🔍", label: "1. Discover", desc: "Find jobs on LinkedIn, Indeed, 70+ boards", color: "#6366f1" },
          { href: "/discover?tab=score", icon: "🤖", label: "2. AI Score", desc: "Rate job fit 1-10 against your profile", color: "#f59e0b" },
          { href: "/apply", icon: "🚀", label: "3. Auto Apply", desc: "Submit applications with your resume & cover letter", color: "#3b82f6" },
          { href: "/applications", icon: "📊", label: "4. Track", desc: "Monitor status, interviews, offers", color: "#10b981" },
        ].map(({ href, icon, label, desc, color }) => (
          <Link key={href} href={href} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.1rem 1.25rem", textDecoration: "none", color: "var(--foreground)", transition: "border-color 0.15s", display: "block" }}>
            <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{icon}</div>
            <div style={{ fontWeight: 700, fontSize: "0.9rem", color, marginBottom: "0.2rem" }}>{label}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted-fg)", lineHeight: 1.4 }}>{desc}</div>
          </Link>
        ))}
      </div>

      {/* Setup checklist */}
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.25rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.875rem" }}>Setup Checklist</h2>
        <SetupChecklist />
      </div>

      {/* Recent applications */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Recent Applications</h2>
        <Link href="/applications" style={{ fontSize: "0.82rem", color: "var(--accent)", textDecoration: "none" }}>View all →</Link>
      </div>
      {recent.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2.5rem", color: "var(--muted-fg)", border: "1px dashed var(--border)", borderRadius: "12px" }}>
          <p>No applications yet — <Link href="/apply" style={{ color: "var(--accent)", textDecoration: "none" }}>start the bot →</Link></p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          {recent.map((j) => (
            <Link key={j.id} href={`/applications/${j.id}`} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "0.75rem 1.1rem", textDecoration: "none", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "1rem", justifyContent: "space-between" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{j.title}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--muted-fg)" }}>{j.company} · {j.platform}</div>
              </div>
              <span style={{ fontSize: "0.75rem", color: "var(--muted-fg)", flexShrink: 0 }}>
                {j.appliedAt ? new Date(j.appliedAt).toLocaleDateString() : "—"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SetupChecklist() {
  const [cfg, setCfg] = useState<ReturnType<typeof loadConfig> | null>(null);
  useEffect(() => { setCfg(loadConfig()); }, []);
  if (!cfg) return null;

  const checks = [
    { label: "Add your name & contact info", done: !!cfg.personal.firstName, href: "/profile" },
    { label: "Upload your resume", done: !!cfg.career.resumeBase64, href: "/profile#resume" },
    { label: "Set your cover letter template", done: !!cfg.career.coverLetter, href: "/profile#cover" },
    { label: "Add your portfolio / website URL", done: !!cfg.personal.website, href: "/profile" },
    { label: "Configure job search terms", done: cfg.search.searchTerms.length > 0, href: "/discover" },
    { label: "Enable at least one platform", done: Object.values(cfg.platforms).some((p) => p.enabled), href: "/platforms" },
  ];

  const done = checks.filter((c) => c.done).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "var(--border)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(done / checks.length) * 100}%`, background: "var(--accent)", borderRadius: "3px", transition: "width 0.4s" }} />
        </div>
        <span style={{ fontSize: "0.8rem", color: "var(--muted-fg)", whiteSpace: "nowrap" }}>{done}/{checks.length}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {checks.map(({ label, done, href }) => (
          <Link key={label} href={href} style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none", color: done ? "var(--muted-fg)" : "var(--foreground)", fontSize: "0.875rem" }}>
            <span style={{ fontSize: "0.9rem" }}>{done ? "✅" : "⬜"}</span>
            <span style={{ textDecoration: done ? "line-through" : "none" }}>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
