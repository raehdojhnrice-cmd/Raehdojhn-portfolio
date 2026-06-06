"use client";
import { useEffect, useState } from "react";
import { loadConfig, saveConfig, loadJobs, saveJobs } from "@/lib/storage";
import { AppConfig, DEFAULT_CONFIG, DiscoveredJob, JobStatus } from "@/lib/types";
import { PageWrap, Card, Field, Input, Select, Toggle, Btn, TagInput, SectionTitle } from "@/components/ui";

type Tab = "search" | "queue";

const SCORE_COLORS = (n: number) =>
  n >= 8 ? "#10b981" : n >= 6 ? "#f59e0b" : n >= 4 ? "#6b7280" : "#ef4444";

export default function DiscoverPage() {
  const [cfg, setCfg] = useState<AppConfig>(DEFAULT_CONFIG);
  const [tab, setTab] = useState<Tab>("search");
  const [jobs, setJobs] = useState<DiscoveredJob[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCfg(loadConfig());
    setJobs(loadJobs());
  }, []);

  function set<K extends keyof AppConfig>(section: K, key: keyof AppConfig[K], val: unknown) {
    setCfg((prev) => ({ ...prev, [section]: { ...prev[section], [key]: val } }));
  }

  function save() {
    saveConfig(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  function updateJobStatus(id: string, status: JobStatus) {
    const updated = jobs.map((j) => (j.id === id ? { ...j, status } : j));
    saveJobs(updated);
    setJobs(updated);
  }

  function deleteJob(id: string) {
    const updated = jobs.filter((j) => j.id !== id);
    saveJobs(updated);
    setJobs(updated);
  }

  const queue = jobs.filter((j) => ["discovered", "scored"].includes(j.status))
    .sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0));

  const s = cfg.search;

  return (
    <PageWrap
      title="Job Discovery"
      subtitle="Configure search filters and review discovered jobs"
      action={
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Btn variant="ghost" onClick={save}>{saved ? "✓ Saved" : "Save"}</Btn>
          <Btn>▶ Run Discovery</Btn>
        </div>
      }
    >
      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
        {[{ id: "search" as Tab, label: "Search Settings" }, { id: "queue" as Tab, label: `Job Queue (${queue.length})` }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "0.5rem 1rem", border: "none", background: "none", cursor: "pointer", fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? "var(--accent)" : "var(--muted-fg)", borderBottom: `2px solid ${tab === t.id ? "var(--accent)" : "transparent"}`, marginBottom: "-1px", fontSize: "0.9rem" }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "search" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Card>
            <SectionTitle>What to Search For</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Field label="Job Titles / Keywords" hint="Press Enter to add each term">
                <TagInput values={s.searchTerms} onChange={(v) => set("search", "searchTerms", v)} placeholder="Software Engineer..." />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                <Field label="Location"><Input value={s.location} onChange={(e) => set("search", "location", e.target.value)} placeholder="United States" /></Field>
                <Field label="Date Posted">
                  <Select value={s.datePosted} onChange={(e) => set("search", "datePosted", e.target.value)}>
                    {["Past 24 hours", "Past week", "Past month", "Any time"].map((o) => <option key={o}>{o}</option>)}
                  </Select>
                </Field>
                <Field label="Minimum Salary"><Input value={s.salary} onChange={(e) => set("search", "salary", e.target.value)} placeholder="$100,000+" /></Field>
                <Field label="Min AI Score to Auto-Approve" hint="Jobs below this score are skipped">
                  <Input type="number" min={1} max={10} value={s.minAiScore} onChange={(e) => set("search", "minAiScore", Number(e.target.value))} />
                </Field>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <Toggle checked={s.easyApplyOnly} onChange={(v) => set("search", "easyApplyOnly", v)} label="Easy Apply only" />
                <Toggle checked={s.remoteOnly} onChange={(v) => set("search", "remoteOnly", v)} label="Remote only" />
                <Toggle checked={s.under10Applicants} onChange={(v) => set("search", "under10Applicants", v)} label="Under 10 applicants" />
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle>Job Type & Experience</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <Field label="Experience Level (select multiple)">
                {["Internship", "Entry level", "Associate", "Mid-Senior level", "Director", "Executive"].map((lvl) => (
                  <label key={lvl} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", cursor: "pointer", marginBottom: "0.2rem" }}>
                    <input type="checkbox" checked={s.experienceLevel.includes(lvl)} onChange={(e) => set("search", "experienceLevel", e.target.checked ? [...s.experienceLevel, lvl] : s.experienceLevel.filter((x) => x !== lvl))} />
                    {lvl}
                  </label>
                ))}
              </Field>
              <Field label="Job Type">
                {["Full-time", "Part-time", "Contract", "Temporary", "Internship"].map((t) => (
                  <label key={t} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", cursor: "pointer", marginBottom: "0.2rem" }}>
                    <input type="checkbox" checked={s.jobType.includes(t)} onChange={(e) => set("search", "jobType", e.target.checked ? [...s.jobType, t] : s.jobType.filter((x) => x !== t))} />
                    {t}
                  </label>
                ))}
              </Field>
              <Field label="On-site / Remote">
                {["On-site", "Hybrid", "Remote"].map((t) => (
                  <label key={t} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", cursor: "pointer", marginBottom: "0.2rem" }}>
                    <input type="checkbox" checked={s.onSite.includes(t)} onChange={(e) => set("search", "onSite", e.target.checked ? [...s.onSite, t] : s.onSite.filter((x) => x !== t))} />
                    {t}
                  </label>
                ))}
              </Field>
            </div>
          </Card>

          <Card>
            <SectionTitle>Filtering Rules</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Field label="Skip jobs containing these words" hint="Case-insensitive match on job title or description">
                <TagInput values={s.badWords} onChange={(v) => set("search", "badWords", v)} placeholder="Crossover, C2C..." />
              </Field>
              <Field label="Skip companies containing these words">
                <TagInput values={s.badCompanyWords} onChange={(v) => set("search", "badCompanyWords", v)} placeholder="Staffing, Recruiting..." />
              </Field>
              <Field label="Prefer companies containing these words">
                <TagInput values={s.goodCompanyWords} onChange={(v) => set("search", "goodCompanyWords", v)} placeholder="Google, Stripe..." />
              </Field>
              <Toggle checked={s.securityClearance} onChange={(v) => set("search", "securityClearance", v)} label="I have security clearance (include clearance jobs)" />
            </div>
          </Card>
        </div>
      )}

      {tab === "queue" && (
        <div>
          {queue.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted-fg)", border: "1px dashed var(--border)", borderRadius: "12px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔍</div>
              <p style={{ fontWeight: 500 }}>No jobs in queue</p>
              <p style={{ fontSize: "0.82rem", marginTop: "0.25rem" }}>Run the bot to discover jobs from your configured platforms</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {queue.map((job) => (
                <div key={job.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted-fg)" }}>
                      {job.company} · {job.location} · {job.platform}
                      {job.salary && ` · ${job.salary}`}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                    {job.aiScore !== null && (
                      <span style={{ fontWeight: 800, fontSize: "1.1rem", color: SCORE_COLORS(job.aiScore) }}>
                        {job.aiScore}/10
                      </span>
                    )}
                    {job.link && (
                      <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none" }}>↗</a>
                    )}
                    <button onClick={() => updateJobStatus(job.id, "approved")} title="Approve" style={{ padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid #10b981", background: "#10b98118", color: "#10b981", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600 }}>
                      ✓ Approve
                    </button>
                    <button onClick={() => updateJobStatus(job.id, "skipped")} title="Skip" style={{ padding: "0.3rem 0.6rem", borderRadius: "6px", border: "1px solid var(--border)", background: "transparent", color: "var(--muted-fg)", cursor: "pointer", fontSize: "0.8rem" }}>
                      Skip
                    </button>
                    <button onClick={() => deleteJob(job.id)} style={{ background: "none", border: "none", color: "var(--muted-fg)", cursor: "pointer", fontSize: "1.1rem" }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </PageWrap>
  );
}
