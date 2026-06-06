"use client";
import { CSSProperties, ReactNode } from "react";

const card: CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
};

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...card, padding: "1.5rem", ...style }}>{children}</div>;
}

export function PageWrap({ children, title, subtitle, action }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</h1>
          {subtitle && <p style={{ color: "var(--muted-fg)", marginTop: "0.2rem", fontSize: "0.9rem" }}>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {children}
      {hint && <span style={{ fontSize: "0.75rem", color: "var(--muted-fg)" }}>{hint}</span>}
    </div>
  );
}

const inputStyle: CSSProperties = {
  padding: "0.5rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--muted)",
  color: "var(--foreground)",
  fontSize: "0.9rem",
  width: "100%",
  outline: "none",
};

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...props.style }} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{ ...inputStyle, minHeight: "80px", resize: "vertical", fontFamily: "inherit", ...props.style }}
    />
  );
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select {...props} style={{ ...inputStyle, ...props.style }}>
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", userSelect: "none" }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: "40px",
          height: "22px",
          borderRadius: "11px",
          background: checked ? "var(--accent)" : "var(--border)",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "3px",
            left: checked ? "21px" : "3px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "white",
            transition: "left 0.2s",
          }}
        />
      </div>
      <span style={{ fontSize: "0.9rem" }}>{label}</span>
    </label>
  );
}

export function Btn({
  children,
  variant = "primary",
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  variant?: "primary" | "ghost" | "danger";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const styles: Record<string, CSSProperties> = {
    primary: { background: "var(--accent)", color: "white", border: "none" },
    ghost: { background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" },
    danger: { background: "#ef4444", color: "white", border: "none" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        padding: "0.55rem 1.1rem",
        borderRadius: "8px",
        fontSize: "0.875rem",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

export function TagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = (e.currentTarget.value || "").trim();
      if (val && !values.includes(val)) onChange([...values, val]);
      e.currentTarget.value = "";
    }
  }
  function remove(v: string) {
    onChange(values.filter((x) => x !== v));
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", padding: "0.4rem", border: "1px solid var(--border)", borderRadius: "8px", background: "var(--muted)", minHeight: "42px" }}>
      {values.map((v) => (
        <span
          key={v}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", background: "var(--accent)", color: "white", borderRadius: "9999px", padding: "0.15rem 0.6rem", fontSize: "0.8rem", fontWeight: 500 }}
        >
          {v}
          <button onClick={() => remove(v)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", lineHeight: 1, padding: 0, fontSize: "1rem" }}>×</button>
        </span>
      ))}
      <input
        onKeyDown={handleKey}
        placeholder={placeholder || "Type and press Enter"}
        style={{ border: "none", background: "none", outline: "none", fontSize: "0.875rem", color: "var(--foreground)", minWidth: "120px", flex: 1 }}
      />
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid var(--border)" }}>
      {children}
    </h2>
  );
}
