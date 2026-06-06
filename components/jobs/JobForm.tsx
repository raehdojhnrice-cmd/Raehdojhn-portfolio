"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { upsertJob } from "@/lib/storage";
import { DiscoveredJob, JobStatus, Platform } from "@/lib/types";
import { PageWrap, Card, Field, Input, Select, Textarea, Btn, SectionTitle } from "@/components/ui";

export default function JobForm() {
  const router = useRouter();
  const [job, setJob] = useState<Partial<DiscoveredJob>>({
    status: "applied",
    platform: "linkedin",
    easyApply: false,
    aiScore: null,
    notes: "",
    salary: "",
    location: "",
  });

  function set(key: keyof DiscoveredJob, val: unknown) {
    setJob((prev) => ({ ...prev, [key]: val }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!job.title || !job.company) return;
    const full: DiscoveredJob = {
      id: crypto.randomUUID(),
      title: job.title ?? "",
      company: job.company ?? "",
      location: job.location ?? "",
      platform: (job.platform as Platform) ?? "other",
      link: job.link ?? "",
      salary: job.salary ?? "",
      description: "",
      discoveredAt: new Date().toISOString(),
      aiScore: job.aiScore ?? null,
      status: (job.status as JobStatus) ?? "applied",
      notes: job.notes ?? "",
      easyApply: job.easyApply ?? false,
      appliedAt: ["applied", "interviewing", "offer", "rejected"].includes(job.status ?? "") ? new Date().toISOString() : null,
    };
    upsertJob(full);
    router.push("/applications");
  }

  return (
    <PageWrap title="Log Application" subtitle="Manually add a job application">
      <form onSubmit={submit}>
        <Card>
          <SectionTitle>Job Details</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <Field label="Job Title *">
              <Input required value={job.title ?? ""} onChange={(e) => set("title", e.target.value)} placeholder="Software Engineer" />
            </Field>
            <Field label="Company *">
              <Input required value={job.company ?? ""} onChange={(e) => set("company", e.target.value)} placeholder="Acme Corp" />
            </Field>
            <Field label="Location">
              <Input value={job.location ?? ""} onChange={(e) => set("location", e.target.value)} placeholder="San Francisco, CA" />
            </Field>
            <Field label="Salary">
              <Input value={job.salary ?? ""} onChange={(e) => set("salary", e.target.value)} placeholder="$120,000" />
            </Field>
            <Field label="Platform">
              <Select value={job.platform ?? "linkedin"} onChange={(e) => set("platform", e.target.value)}>
                {(["linkedin","indeed","glassdoor","ziprecruiter","greenhouse","lever","workday","ashby","other"] as Platform[]).map((p) => (
                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select value={job.status ?? "applied"} onChange={(e) => set("status", e.target.value)}>
                {(["saved","applied","interviewing","offer","rejected","withdrawn"] as JobStatus[]).map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </Select>
            </Field>
            <Field label="Job Link / URL">
              <Input type="url" value={job.link ?? ""} onChange={(e) => set("link", e.target.value)} placeholder="https://..." />
            </Field>
            <Field label="AI Score (1-10)">
              <Input type="number" min={1} max={10} value={job.aiScore ?? ""} onChange={(e) => set("aiScore", e.target.value ? Number(e.target.value) : null)} placeholder="Leave blank if unknown" />
            </Field>
          </div>
          <Field label="Notes">
            <Textarea value={job.notes ?? ""} onChange={(e) => set("notes", e.target.value)} placeholder="Recruiter name, interview stage, anything useful..." />
          </Field>
        </Card>

        <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => router.back()}>Cancel</Btn>
          <Btn type="submit">Save Application</Btn>
        </div>
      </form>
    </PageWrap>
  );
}
