"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadJobs, saveJobs } from "@/lib/storage";
import { DiscoveredJob, JobStatus } from "@/lib/types";
import { PageWrap, Card, Field, Select, Textarea, Btn, SectionTitle } from "@/components/ui";

const STATUSES: JobStatus[] = ["discovered", "scored", "approved", "applied", "interviewing", "offer", "rejected", "withdrawn"];

export default function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<DiscoveredJob | null>(null);

  useEffect(() => {
    const found = loadJobs().find((j) => j.id === id) ?? null;
    setJob(found);
  }, [id]);

  function update(key: keyof DiscoveredJob, val: unknown) {
    if (!job) return;
    const updated = { ...job, [key]: val };
    setJob(updated);
    const all = loadJobs().map((j) => (j.id === id ? updated : j));
    saveJobs(all);
  }

  function deleteJob() {
    if (!confirm("Delete this job?")) return;
    saveJobs(loadJobs().filter((j) => j.id !== id));
    router.push("/applications");
  }

  if (!job) return <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted-fg)" }}>Job not found</div>;

  return (
    <PageWrap
      title={job.title}
      subtitle={`${job.company} · ${job.platform}`}
      action={<Btn variant="danger" onClick={deleteJob}>Delete</Btn>}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Card>
          <SectionTitle>Application Details</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <Field label="Status">
              <Select value={job.status} onChange={(e) => update("status", e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </Select>
            </Field>
            <Field label="Location"><div style={{ fontSize: "0.9rem", padding: "0.5rem 0" }}>{job.location || "—"}</div></Field>
            <Field label="Salary"><div style={{ fontSize: "0.9rem", padding: "0.5rem 0" }}>{job.salary || "—"}</div></Field>
            <Field label="AI Score"><div style={{ fontSize: "1.2rem", fontWeight: 800, padding: "0.25rem 0", color: job.aiScore && job.aiScore >= 7 ? "#10b981" : job.aiScore && job.aiScore >= 5 ? "#f59e0b" : "var(--muted-fg)" }}>{job.aiScore !== null ? `${job.aiScore}/10` : "—"}</div></Field>
            <Field label="Discovered"><div style={{ fontSize: "0.9rem", padding: "0.5rem 0" }}>{new Date(job.discoveredAt).toLocaleString()}</div></Field>
            <Field label="Applied"><div style={{ fontSize: "0.9rem", padding: "0.5rem 0" }}>{job.appliedAt ? new Date(job.appliedAt).toLocaleString() : "—"}</div></Field>
          </div>
        </Card>

        <Card>
          <SectionTitle>Notes</SectionTitle>
          <Textarea value={job.notes} onChange={(e) => update("notes", e.target.value)} style={{ minHeight: "100px" }} placeholder="Recruiter contact, interview notes, next steps..." />
        </Card>

        {job.description && (
          <Card>
            <SectionTitle>Job Description</SectionTitle>
            <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "var(--foreground)", whiteSpace: "pre-wrap", maxHeight: "300px", overflowY: "auto" }}>
              {job.description}
            </div>
          </Card>
        )}

        {job.link && (
          <a href={job.link} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", fontSize: "0.875rem", textDecoration: "none" }}>
            ↗ View original job posting
          </a>
        )}
      </div>
    </PageWrap>
  );
}
