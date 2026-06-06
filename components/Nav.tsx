"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Dashboard", icon: "⚡" },
  { href: "/discover", label: "Discover", icon: "🔍" },
  { href: "/apply", label: "Auto Apply", icon: "🚀" },
  { href: "/applications", label: "Applications", icon: "📋" },
  { href: "/profile", label: "Profile", icon: "👤" },
  { href: "/platforms", label: "Platforms", icon: "🌐" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          background: "rgba(255,255,255,0.85)",
          borderBottom: "1px solid var(--border)",
        }}
        className="dark-nav"
      >
        <style>{`
          @media (prefers-color-scheme: dark) { .dark-nav { background: rgba(9,9,11,0.88) !important; } }
        `}</style>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.25rem", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <Link href="/" style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.02em", color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "1.2rem" }}>⚡</span> CareerOps
          </Link>

          {/* Desktop links */}
          <div style={{ display: "flex", gap: "0.1rem", alignItems: "center" }} className="desktop-nav">
            <style>{`.desktop-nav { display: flex !important; } @media(max-width:768px) { .desktop-nav { display: none !important; } }`}</style>
            {links.slice(1).map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} style={{ padding: "0.4rem 0.7rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: active ? 600 : 400, textDecoration: "none", background: active ? "var(--accent)" : "transparent", color: active ? "white" : "var(--muted-fg)", transition: "all 0.15s" }}>
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="mobile-btn" style={{ background: "none", border: "1px solid var(--border)", borderRadius: "8px", padding: "0.4rem 0.6rem", cursor: "pointer", color: "var(--foreground)", fontSize: "1rem", display: "none" }}>
            <style>{`@media(max-width:768px) { .mobile-btn { display: block !important; } }`}</style>
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div style={{ borderTop: "1px solid var(--border)", padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem", background: "var(--card)" }} className="mobile-menu">
            {links.map(({ href, label, icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href} onClick={() => setOpen(false)} style={{ padding: "0.6rem 0.75rem", borderRadius: "8px", fontSize: "0.9rem", fontWeight: active ? 600 : 400, textDecoration: "none", background: active ? "var(--accent)" : "transparent", color: active ? "white" : "var(--foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span>{icon}</span>{label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}
