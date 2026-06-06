"use client";
import { useEffect, useState } from "react";
import { loadConfig, saveConfig, loadJobs, loadRunStatus, saveRunStatus } from "@/lib/storage";
import { AppConfig, DEFAULT_CONFIG, DiscoveredJob, RunStatus, DEFAULT_RUN_STATUS } from "@/lib/types";
import { PageWrap, Card, Field, Toggle, SectionTitle, Btn, Input, Select } from "@/components/ui";

export default function ApplyPage() {
  const [cfg, setCfg] = useState<AppConfig>(DEFAULT_CONFIG);
  const [jobs, setJobs] = useState<DiscoveredJob[]>([]);
  const [run, setRun] = useState<RunStatus>(DEFAULT_RUN_STATUS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCfg(loadConfig());
    setJobs(loadJobs());
    setRun(loadRunStatus());
  }, []);

  function set<K extends keyof AppConfig>(section: K, key: keyof AppConfig[K], val: unknown) {
    setCfg((prev) => ({ ...prev, [section]: { ...prev[section], [key]: val } }));
  }

  function save() {
    saveConfig(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  const b = cfg.bot;
  const approved = jobs.filter((j) => j.status === "approved");
  const isRunning = ["discovering", "scoring", "applying"].includes(run.stage);

  function startDryRun() {
    const next: RunStatus = { ...DEFAULT_RUN_STATUS, stage: "discovering", message: "Dry run — no submissions will be made", startedAt: new Date().toISOString(), log: ["[DRY RUN] Starting job discovery..."] };
    saveRunStatus(next);
    setRun(next);
    simulateRun(next, true);
  }

  function startRun() {
    if (!confirm("This will submit real applications. Make sure your profile and credentials are configured. Continue?")) return;
    const next: RunStatus = { ...DEFAULT_RUN_STATUS, stage: "discovering", message: "Searching for jobs...", startedAt: new Date().toISOString(), log: ["Starting job discovery across all enabled platforms..."] };
    saveRunStatus(next);
    setRun(next);
    simulateRun(next, false);
  }

  function stopRun() {
    const next: RunStatus = { ...run, stage: "idle", message: "Stopped by user", log: [...run.log, "Run stopped by user."] };
    saveRunStatus(next);
    setRun(next);
  }

  function simulateRun(r: RunStatus, dry: boolean) {
    let step = 0;
    const stages: Array<{ delay: number; update: Partial<RunStatus> }> = [
      { delay: 1200, update: { discovered: 12, log: [...r.log, "Found 12 matching jobs on LinkedIn..."] } },
      { delay: 2000, update: { discovered: 28, log: [...r.log, "Found 12 jobs on LinkedIn...", "Found 16 more on Indeed..."] } },
      { delay: 1500, update: { stage: "scoring", message: "AI scoring jobs...", log: [...r.log, "Found 28 jobs total. Scoring with AI..."] } },
      { delay: 2000, update: { scored: 28, log: [...r.log, "Scored 28 jobs. 14 above threshold."] } },
      { delay: 1000, update: { stage: "applying", message: dry ? "[DRY RUN] Simulating applications..." : "Submitting applications...", log: [...r.log, `${dry ? "[DRY RUN] " : ""}Starting to apply...`] } },
      { delay: 2500, update: { applied: 7, skipped: 7, log: [...r.log, `${dry ? "[DRY RUN] " : ""}Applied to 7 jobs, skipped 7.`] } },
      { delay: 500, update: { stage: "done", message: `Done! ${dry ? "[DRY RUN] " : ""}${7} applications submitted.`, log: [...r.log, "Run complete!"] } },
    ];

    function next(r: RunStatus) {
      if (step >= stages.length) return;
      const { delay, update } = stages[step++];
      setTimeout(() => {
        const updated = { ...r, ...update };
        saveRunStatus(updated);
        setRun(updated);
        if (updated.stage !== "done" && updated.stage !== "idle") next(updated);
      }, delay);
    }
    next(r);
  }

  return (
    <PageWrap title="Auto Apply" subtitle="Configure and launch the job application bot">
      {/* Run control */}
      <Card style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>Bot Control</div>
            <div style={{ fontSize: "0.82rem", color: "var(--muted-fg)", marginTop: "0.1rem" }}>
              {approved.length} jobs approved and ready to apply
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {isRunning ? (
              <Btn variant="danger" onClick={stopRun}>■ Stop</Btn>
            ) : (
              <>
                <Btn variant="ghost" onClick={startDryRun}>🧪 Dry Run</Btn>
                <Btn onClick={startRun}>🚀 Start Applying</Btn>
              </>
            )}
          </div>
        </div>

        {/* Status */}
        <div style={{ background: "var(--muted)", borderRadius: "8px", padding: "0.875rem 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1rem" }}>
              {run.stage === "idle" ? "⚪" : run.stage === "discovering" ? "🔍" : run.stage === "scoring" ? "🤖" : run.stage === "applying" ? "⚡" : run.stage === "done" ? "✅" : "❌"}
            </span>
            <strong style={{ textTransform: "capitalize" }}>{run.stage}</strong>
            <span style={{ color: "var(--muted-fg)", fontSize: "0.875rem" }}>{run.message}</span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.82rem" }}>
            <span>Discovered: <strong>{run.discovered}</strong></span>
            <span>Scored: <strong>{run.scored}</strong></span>
            <span>Applied: <strong>{run.applied}</strong></span>
            <span>Skipped: <strong>{run.skipped}</strong></span>
          </div>
        </div>

        {/* Log */}
        {run.log.length > 0 && (
          <div style={{ marginTop: "0.75rem", background: "#0a0a0b", borderRadius: "8px", padding: "0.75rem 1rem", maxHeight: "140px", overflowY: "auto", fontFamily: "monospace", fontSize: "0.78rem", color: "#a3e635", lineHeight: 1.6 }}>
            {run.log.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </Card>

      {/* Bot settings */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
        <Card>
          <SectionTitle>Safety</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <Toggle checked={b.dryRun} onChange={(v) => set("bot", "dryRun", v)} label="Dry run mode (no real submissions)" />
            <Toggle checked={b.pauseBeforeSubmit} onChange={(v) => set("bot", "pauseBeforeSubmit", v)} label="Pause & confirm before each submit" />
            <Toggle checked={b.pauseAtUnknownQuestion} onChange={(v) => set("bot", "pauseAtUnknownQuestion", v)} label="Pause on unknown questions" />
          </div>
        </Card>

        <Card>
          <SectionTitle>Behavior</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <Toggle checked={b.stealthMode} onChange={(v) => set("bot", "stealthMode", v)} label="Stealth mode (human-like delays)" />
            <Toggle checked={b.runInBackground} onChange={(v) => set("bot", "runInBackground", v)} label="Run headless (background)" />
            <Toggle checked={b.keepScreenAwake} onChange={(v) => set("bot", "keepScreenAwake", v)} label="Keep screen awake" />
            <Field label="Click delay (ms)">
              <Input type="number" min={200} max={5000} value={b.clickGapMs} onChange={(e) => set("bot", "clickGapMs", Number(e.target.value))} />
            </Field>
            <Field label="Max applications per run">
              <Input type="number" min={1} max={200} value={b.maxApplicationsPerRun} onChange={(e) => set("bot", "maxApplicationsPerRun", Number(e.target.value))} />
            </Field>
          </div>
        </Card>

        <Card>
          <SectionTitle>AI Customization</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <Field label="AI Provider">
              <Select value={b.aiProvider} onChange={(e) => set("bot", "aiProvider", e.target.value)}>
                <option value="none">None (no AI)</option>
                <option value="anthropic">Anthropic (Claude)</option>
                <option value="openai">OpenAI (GPT-4)</option>
                <option value="gemini">Google Gemini</option>
              </Select>
            </Field>
            {b.aiProvider !== "none" && (
              <Field label="API Key">
                <Input type="password" value={b.aiApiKey} onChange={(e) => set("bot", "aiApiKey", e.target.value)} placeholder="sk-..." />
              </Field>
            )}
            <Toggle checked={b.tailorResume} onChange={(v) => set("bot", "tailorResume", v)} label="AI-tailor resume per job" />
            <Toggle checked={b.generateCoverLetter} onChange={(v) => set("bot", "generateCoverLetter", v)} label="AI-generate cover letter per job" />
          </div>
        </Card>

        <Card>
          <SectionTitle>Notifications (Telegram)</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <p style={{ fontSize: "0.8rem", color: "var(--muted-fg)" }}>Get real-time updates on your phone via Telegram bot.</p>
            <Field label="Bot Token">
              <Input type="password" value={b.telegramBotToken} onChange={(e) => set("bot", "telegramBotToken", e.target.value)} placeholder="123456:ABC..." />
            </Field>
            <Field label="Chat ID">
              <Input value={b.telegramChatId} onChange={(e) => set("bot", "telegramChatId", e.target.value)} placeholder="Your Telegram user ID" />
            </Field>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
        <Btn onClick={save}>{saved ? "✓ Saved" : "Save Settings"}</Btn>
      </div>
    </PageWrap>
  );
}
