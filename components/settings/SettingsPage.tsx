"use client";
import { useRef, useState } from "react";
import { exportData, importData } from "@/lib/storage";
import { PageWrap, Card, Btn, SectionTitle } from "@/components/ui";

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  function handleExport() {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `careerops-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flash("Exported successfully");
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(reader.result as string);
      flash(ok ? "Imported successfully — refresh to see changes" : "Invalid backup file");
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function clearAll() {
    if (!confirm("This will permanently delete all your data. Are you sure?")) return;
    localStorage.clear();
    flash("All data cleared — refresh to start fresh");
  }

  function flash(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <PageWrap title="Settings" subtitle="Data management and app configuration">
      {msg && (
        <div style={{ background: "#10b98118", border: "1px solid #10b98144", borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1rem", fontSize: "0.875rem", color: "#10b981" }}>
          {msg}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Card>
          <SectionTitle>Backup & Restore</SectionTitle>
          <p style={{ fontSize: "0.875rem", color: "var(--muted-fg)", marginBottom: "1rem", lineHeight: 1.5 }}>
            Export your full config and job history as JSON. Import it on another device or browser to sync your data across MacBook and mobile.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Btn onClick={handleExport}>📥 Export All Data</Btn>
            <Btn variant="ghost" onClick={() => fileRef.current?.click()}>📤 Import Backup</Btn>
            <input type="file" accept=".json" ref={fileRef} style={{ display: "none" }} onChange={handleImport} />
          </div>
        </Card>

        <Card>
          <SectionTitle>How to Use on Mobile</SectionTitle>
          <div style={{ fontSize: "0.875rem", color: "var(--foreground)", lineHeight: 1.7 }}>
            <p style={{ marginBottom: "0.75rem" }}>CareerOps is a Progressive Web App (PWA) — you can install it on your phone like a native app:</p>
            <ol style={{ paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li><strong>iPhone/Safari:</strong> Open the app → tap the Share button → &ldquo;Add to Home Screen&rdquo;</li>
              <li><strong>Android/Chrome:</strong> Open the app → tap menu (⋮) → &ldquo;Add to Home Screen&rdquo;</li>
              <li>Use Export/Import to sync your config between MacBook and mobile</li>
            </ol>
            <p style={{ marginTop: "0.75rem", color: "var(--muted-fg)" }}>
              The automation bot itself runs on your MacBook. The mobile app lets you review the job queue, check stats, and update application statuses from anywhere.
            </p>
          </div>
        </Card>

        <Card>
          <SectionTitle>Python Backend Setup</SectionTitle>
          <p style={{ fontSize: "0.875rem", color: "var(--muted-fg)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
            The browser UI is the control panel. The actual automation runs via the Python backend on your MacBook.
          </p>
          <div style={{ background: "#0a0a0b", borderRadius: "8px", padding: "0.875rem 1rem", fontFamily: "monospace", fontSize: "0.78rem", color: "#a3e635", lineHeight: 1.8 }}>
            <div style={{ color: "#6b7280" }}># Install dependencies</div>
            <div>pip install -r backend/requirements.txt</div>
            <div style={{ marginTop: "0.5rem", color: "#6b7280" }}># Install Playwright browsers</div>
            <div>playwright install chromium</div>
            <div style={{ marginTop: "0.5rem", color: "#6b7280" }}># Start backend API</div>
            <div>python backend/main.py</div>
            <div style={{ marginTop: "0.5rem", color: "#6b7280" }}># In another terminal, start the web app</div>
            <div>npm run dev</div>
          </div>
        </Card>

        <Card>
          <SectionTitle>Danger Zone</SectionTitle>
          <p style={{ fontSize: "0.875rem", color: "var(--muted-fg)", marginBottom: "1rem" }}>
            This will delete all your profile config, platform credentials, and job history from this browser.
          </p>
          <Btn variant="danger" onClick={clearAll}>🗑 Clear All Data</Btn>
        </Card>
      </div>
    </PageWrap>
  );
}
