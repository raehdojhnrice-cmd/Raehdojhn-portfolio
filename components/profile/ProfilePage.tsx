"use client";
import { useEffect, useRef, useState } from "react";
import { loadConfig, saveConfig } from "@/lib/storage";
import { AppConfig, DEFAULT_CONFIG } from "@/lib/types";
import { PageWrap, Card, Field, Input, Textarea, Select, Toggle, SectionTitle, Btn, TagInput } from "@/components/ui";

type Tab = "personal" | "career" | "resume";

export default function ProfilePage() {
  const [cfg, setCfg] = useState<AppConfig>(DEFAULT_CONFIG);
  const [tab, setTab] = useState<Tab>("personal");
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setCfg(loadConfig()); }, []);

  function save() {
    saveConfig(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function set<K extends keyof AppConfig>(section: K, key: keyof AppConfig[K], val: unknown) {
    setCfg((prev) => ({ ...prev, [section]: { ...prev[section], [key]: val } }));
  }

  function handleResume(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      set("career", "resumeBase64", reader.result as string);
      set("career", "resumeFileName", file.name);
    };
    reader.readAsDataURL(file);
  }

  const p = cfg.personal;
  const c = cfg.career;

  const tabs: { id: Tab; label: string }[] = [
    { id: "personal", label: "Personal Info" },
    { id: "career", label: "Career Details" },
    { id: "resume", label: "Resume & Cover Letter" },
  ];

  return (
    <PageWrap
      title="Profile"
      subtitle="Your information used to fill application forms"
      action={<Btn onClick={save}>{saved ? "✓ Saved!" : "Save Profile"}</Btn>}
    >
      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ padding: "0.5rem 1rem", border: "none", background: "none", cursor: "pointer", fontWeight: tab === t.id ? 700 : 400, color: tab === t.id ? "var(--accent)" : "var(--muted-fg)", borderBottom: `2px solid ${tab === t.id ? "var(--accent)" : "transparent"}`, marginBottom: "-1px", fontSize: "0.9rem", transition: "all 0.15s" }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "personal" && (
        <Card>
          <SectionTitle>Identity</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <Field label="First Name"><Input value={p.firstName} onChange={(e) => set("personal", "firstName", e.target.value)} /></Field>
            <Field label="Middle Name"><Input value={p.middleName} onChange={(e) => set("personal", "middleName", e.target.value)} /></Field>
            <Field label="Last Name"><Input value={p.lastName} onChange={(e) => set("personal", "lastName", e.target.value)} /></Field>
            <Field label="Email"><Input type="email" value={p.email} onChange={(e) => set("personal", "email", e.target.value)} /></Field>
            <Field label="Phone"><Input type="tel" value={p.phone} onChange={(e) => set("personal", "phone", e.target.value)} /></Field>
          </div>

          <SectionTitle>Location</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <Field label="City"><Input value={p.city} onChange={(e) => set("personal", "city", e.target.value)} /></Field>
            <Field label="State"><Input value={p.state} onChange={(e) => set("personal", "state", e.target.value)} /></Field>
            <Field label="Zip Code"><Input value={p.zipcode} onChange={(e) => set("personal", "zipcode", e.target.value)} /></Field>
            <Field label="Country"><Input value={p.country} onChange={(e) => set("personal", "country", e.target.value)} /></Field>
          </div>

          <SectionTitle>Online Presence</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <Field label="LinkedIn URL"><Input value={p.linkedIn} onChange={(e) => set("personal", "linkedIn", e.target.value)} placeholder="https://linkedin.com/in/..." /></Field>
            <Field label="Portfolio / Website" hint="Shared with every application"><Input value={p.website} onChange={(e) => set("personal", "website", e.target.value)} placeholder="https://yoursite.com" /></Field>
            <Field label="GitHub"><Input value={p.github} onChange={(e) => set("personal", "github", e.target.value)} placeholder="https://github.com/..." /></Field>
          </div>

          <SectionTitle>Equal Opportunity</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { label: "Gender", key: "gender", opts: ["Decline", "Male", "Female", "Non-binary", "Other"] },
              { label: "Ethnicity", key: "ethnicity", opts: ["Decline", "Hispanic/Latino", "Asian", "White", "Black or African American", "American Indian or Alaska Native", "Native Hawaiian or Other Pacific Islander", "Other"] },
              { label: "Disability Status", key: "disabilityStatus", opts: ["Decline", "Yes", "No"] },
              { label: "Veteran Status", key: "veteranStatus", opts: ["Decline", "Yes", "No"] },
            ].map(({ label, key, opts }) => (
              <Field key={key} label={label}>
                <Select value={(p as unknown as Record<string, string>)[key]} onChange={(e) => set("personal", key as keyof typeof p, e.target.value)}>
                  {opts.map((o) => <option key={o}>{o}</option>)}
                </Select>
              </Field>
            ))}
          </div>
        </Card>
      )}

      {tab === "career" && (
        <Card>
          <SectionTitle>Experience</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <Field label="Current/Recent Title"><Input value={c.currentTitle} onChange={(e) => set("career", "currentTitle", e.target.value)} /></Field>
            <Field label="Current/Recent Employer"><Input value={c.currentEmployer} onChange={(e) => set("career", "currentEmployer", e.target.value)} /></Field>
            <Field label="Years of Experience"><Input type="number" value={c.yearsOfExperience} onChange={(e) => set("career", "yearsOfExperience", e.target.value)} /></Field>
            <Field label="Notice Period (days)"><Input type="number" value={c.noticePeriod} onChange={(e) => set("career", "noticePeriod", Number(e.target.value))} /></Field>
            <Field label="Desired Salary (USD)"><Input type="number" value={c.desiredSalary || ""} onChange={(e) => set("career", "desiredSalary", Number(e.target.value))} placeholder="120000" /></Field>
            <Field label="Minimum Acceptable Salary"><Input type="number" value={c.desiredSalaryMin || ""} onChange={(e) => set("career", "desiredSalaryMin", Number(e.target.value))} placeholder="100000" /></Field>
          </div>

          <SectionTitle>Headline & Summary</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
            <Field label="Professional Headline"><Input value={c.headline} onChange={(e) => set("career", "headline", e.target.value)} placeholder="Senior Software Engineer · React · Node.js" /></Field>
            <Field label="Summary"><Textarea value={c.summary} onChange={(e) => set("career", "summary", e.target.value)} style={{ minHeight: "100px" }} placeholder="Brief professional summary shown on applications..." /></Field>
          </div>

          <SectionTitle>Work Authorization</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <Field label="US Citizenship Status">
              <Select value={c.usCitizenship} onChange={(e) => set("career", "usCitizenship", e.target.value)}>
                {["U.S. Citizen/Permanent Resident", "H1-B", "OPT/CPT", "TN Visa", "Other"].map((o) => <option key={o}>{o}</option>)}
              </Select>
            </Field>
            <Field label="Visa Sponsorship Required?">
              <div style={{ marginTop: "0.5rem" }}>
                <Toggle checked={c.requireVisa} onChange={(v) => set("career", "requireVisa", v)} label="Yes, I need sponsorship" />
              </div>
            </Field>
          </div>

          <SectionTitle>Skills & Targets</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Field label="Skills" hint="Press Enter or comma to add"><TagInput values={c.skills} onChange={(v) => set("career", "skills", v)} placeholder="React, Python, AWS..." /></Field>
            <Field label="Target Roles"><TagInput values={c.targetRoles} onChange={(v) => set("career", "targetRoles", v)} placeholder="Software Engineer..." /></Field>
            <Field label="Target Companies (optional)"><TagInput values={c.targetCompanies} onChange={(v) => set("career", "targetCompanies", v)} placeholder="Google, Meta..." /></Field>
            <Field label="Companies to Avoid"><TagInput values={c.avoidCompanies} onChange={(v) => set("career", "avoidCompanies", v)} placeholder="Crossover, Staffing Co..." /></Field>
          </div>
        </Card>
      )}

      {tab === "resume" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Card style={{ scrollMarginTop: "70px" }}>
            <SectionTitle>Resume</SectionTitle>
            <input type="file" accept=".pdf,.doc,.docx" ref={fileRef} style={{ display: "none" }} onChange={handleResume} />
            {c.resumeFileName ? (
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem", background: "var(--muted)", borderRadius: "8px", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>📄</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.resumeFileName}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted-fg)" }}>Uploaded & ready</div>
                </div>
                {c.resumeBase64 && (
                  <a href={c.resumeBase64} download={c.resumeFileName} style={{ marginLeft: "auto", color: "var(--accent)", fontSize: "0.82rem", textDecoration: "none" }}>
                    Download
                  </a>
                )}
              </div>
            ) : (
              <div style={{ border: "2px dashed var(--border)", borderRadius: "10px", padding: "2rem", textAlign: "center", marginBottom: "0.75rem", color: "var(--muted-fg)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📎</div>
                <p style={{ fontSize: "0.875rem" }}>No resume uploaded yet</p>
              </div>
            )}
            <Btn variant="ghost" onClick={() => fileRef.current?.click()}>
              {c.resumeFileName ? "Replace Resume" : "Upload Resume (PDF/DOC)"}
            </Btn>
            <p style={{ fontSize: "0.75rem", color: "var(--muted-fg)", marginTop: "0.5rem" }}>
              Stored locally in your browser. Never sent to any server.
            </p>
          </Card>

          <Card>
            <SectionTitle>Default Cover Letter Template</SectionTitle>
            <p style={{ fontSize: "0.82rem", color: "var(--muted-fg)", marginBottom: "0.75rem" }}>
              Use <code style={{ background: "var(--muted)", padding: "0.1rem 0.3rem", borderRadius: "4px" }}>{"{company}"}</code>, <code style={{ background: "var(--muted)", padding: "0.1rem 0.3rem", borderRadius: "4px" }}>{"{role}"}</code> as placeholders. AI can tailor this per job if enabled.
            </p>
            <Textarea
              value={c.coverLetter}
              onChange={(e) => set("career", "coverLetter", e.target.value)}
              style={{ minHeight: "220px" }}
              placeholder={`Dear Hiring Manager,\n\nI am excited to apply for the {role} position at {company}...\n\nBest regards,\n${p.firstName} ${p.lastName}`}
            />
          </Card>
        </div>
      )}

      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
        <Btn onClick={save}>{saved ? "✓ Saved!" : "Save Profile"}</Btn>
      </div>
    </PageWrap>
  );
}
