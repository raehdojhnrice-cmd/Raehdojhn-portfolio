import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Raehdojhn | Portfolio & Career Ops",
  description: "Portfolio and career operations hub — track jobs, showcase work, manage your career.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CareerOps",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Nav />
        <main style={{ flex: 1 }}>{children}</main>
        <footer
          style={{
            padding: "1.5rem",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--muted-fg)",
            borderTop: "1px solid var(--border)",
          }}
        >
          © {new Date().getFullYear()} Raehdojhn · Portfolio &amp; Career Ops
        </footer>
      </body>
    </html>
  );
}
