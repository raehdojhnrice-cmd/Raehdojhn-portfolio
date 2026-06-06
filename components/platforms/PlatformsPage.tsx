"use client";
import { useEffect, useState } from "react";
import { loadConfig, saveConfig } from "@/lib/storage";
import { AppConfig, DEFAULT_CONFIG, Platform } from "@/lib/types";
import { PageWrap, Card, Field, Input, Toggle, Btn, SectionTitle } from "@/components/ui";

const PLATFORM_INFO: Record<Platform, { label: string; icon: string; note: string; supportsEasyApply?: boolean }> = {
  linkedin: { label: "LinkedIn", icon: "🔵", note: "Easy Apply + full applications. Most jobs.", supportsEasyApply: true },
  indeed: { label: "Indeed", icon: "🟡", note: "SmartApply and direct applications.", supportsEasyApply: true },
  glassdoor: { label: "Glassdoor", icon: "🟢", note: "Easy Apply integration." },
  ziprecruiter: { label: "ZipRecruiter", icon: "🟠", note: "One-click apply for many listings." },
  greenhouse: { label: "Greenhouse", icon: "🌿", note: "ATS platform used by many startups." },
  lever: { label: "Lever", icon: "⚙️", note: "ATS platform used by tech companies." },
  workday: { label: "Workday", icon: "☁️", note: "Enterprise ATS. 48+ portals supported." },
  ashby: { label: "Ashby", icon: "📊", note: "Modern ATS used by fast-growing companies." },
  rippling: { label: "Rippling", icon: "🔧", note: "HR platform with job listings." },
  other: { label: "Other / Universal", icon: "🌐", note: "Generic form-fill for any job portal." },
};

export default function PlatformsPage() {
  const [cfg, setCfg] = useState<AppConfig>(DEFAULT_CONFIG);
  const [saved, setSaved] = useState(false);

  useEffect(() => { setCfg(loadConfig()); }, []);

  function setPlatform(platform: Platform, key: string, val: unknown) {
    setCfg((prev) => ({
      ...prev,
      platforms: {
        ...prev.platforms,
        [platform]: { ...prev.platforms[platform], [key]: val },
      },
    }));
  }

  function save() {
    saveConfig(cfg);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  const enabledCount = Object.values(cfg.platforms).filter((p) => p.enabled).length;

  return (
    <PageWrap
      title="Platforms"
      subtitle={`${enabledCount} platform${enabledCount !== 1 ? "s" : ""} enabled`}
      action={<Btn onClick={save}>{saved ? "✓ Saved" : "Save Platforms"}</Btn>}
    >
      <div style={{ background: "#f59e0b18", border: "1px solid #f59e0b44", borderRadius: "10px", padding: "0.875rem 1.25rem", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
        ⚠️ <strong>Security note:</strong> Credentials are stored only in your browser&apos;s localStorage. Never shared externally. Use app-specific passwords or cookies where possible.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {(Object.keys(PLATFORM_INFO) as Platform[]).map((platform) => {
          const info = PLATFORM_INFO[platform];
          const p = cfg.platforms[platform];
          return (
            <Card key={platform}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: p.enabled ? "1rem" : "0" }}>
                <span style={{ fontSize: "1.4rem" }}>{info.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>{info.label}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--muted-fg)" }}>{info.note}</div>
                </div>
                <Toggle
                  checked={p.enabled}
                  onChange={(v) => setPlatform(platform, "enabled", v)}
                  label=""
                />
              </div>

              {p.enabled && (
                <>
                  <div style={{ height: "1px", background: "var(--border)", marginBottom: "1rem" }} />
                  <SectionTitle>Credentials for {info.label}</SectionTitle>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                    <Field label="Username / Email">
                      <Input
                        type="email"
                        value={p.username}
                        onChange={(e) => setPlatform(platform, "username", e.target.value)}
                        placeholder="your@email.com"
                        autoComplete="off"
                      />
                    </Field>
                    <Field label="Password">
                      <Input
                        type="password"
                        value={p.password}
                        onChange={(e) => setPlatform(platform, "password", e.target.value)}
                        placeholder="••••••••"
                        autoComplete="new-password"
                      />
                    </Field>
                    <Field label="Session Cookies (optional)" hint="Paste cookies to avoid re-login; more stable than password">
                      <Input
                        value={p.sessionCookies}
                        onChange={(e) => setPlatform(platform, "sessionCookies", e.target.value)}
                        placeholder="li_at=..."
                      />
                    </Field>
                  </div>
                </>
              )}
            </Card>
          );
        })}
      </div>

      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
        <Btn onClick={save}>{saved ? "✓ Saved" : "Save Platforms"}</Btn>
      </div>
    </PageWrap>
  );
}
