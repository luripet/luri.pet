"use client";

import { Avatar, DiscordMeta, useBioLine } from "@/components/DiscordActivity";
import { ThemeToggle } from "@/components/ThemeToggle";

/* ── Icons ──────────────────────────────────────────────────── */

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.733-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0a12 12 0 0 0-3.794 23.4c.6.11.82-.26.82-.577v-2.04c-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.218.694.825.576A12 12 0 0 0 12 0z"/>
    </svg>
  );
}

/* ── Live clock ──────────────────────────────────────────────── */

import { useEffect, useState } from "react";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ── Social links ───────────────────────────────────────────── */

const LINKS = [
  { href: "https://x.com/luripet",                        icon: <XIcon />,       label: "X (Twitter)" },
  { href: "https://discord.com/users/1143759602446508183", icon: <DiscordIcon />, label: "Discord"     },
  { href: "https://github.com/luripet",                    icon: <GitHubIcon />,  label: "GitHub"      },
];

/* ── Page ───────────────────────────────────────────────────── */

export default function Page() {
  const now     = useClock();
  const bioLine = useBioLine();

  const dateStr = now
    ? now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : null;
  const timeStr = now
    ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true })
    : null;

  return (
    <div style={{
      position: "relative",
      zIndex: 1,
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "48px 24px",
      maxWidth: 520,
      margin: "0 auto",
    }}>

      {/* theme toggle — top right of the page */}
      <div className="fade-up" style={{ position: "fixed", top: 20, right: 24 }}>
        <ThemeToggle />
      </div>

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
        <Avatar />
        <div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--fg)",
            lineHeight: 1.15,
            marginBottom: 3,
          }}>
            luripet
          </h1>
          <p style={{
            fontSize: 13,
            color: "var(--fg-2)",
            lineHeight: 1.4,
          }}>
            {bioLine ?? "Web Developer / Security Researcher"}
          </p>
        </div>
      </div>

      {/* ── Social icons ─────────────────────────────────────── */}
      <div className="fade-up d1" style={{ display: "flex", gap: 14, marginBottom: 36, paddingLeft: 66 }}>
        {LINKS.map(l => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="slink"
            aria-label={l.label}
            title={l.label}
          >
            {l.icon}
          </a>
        ))}
      </div>

      {/* ── Meta block ───────────────────────────────────────── */}
      <div className="fade-up d2" style={{ display: "flex", flexDirection: "column", gap: 2 }}>

        {/* date · time */}
        {dateStr && timeStr && (
          <div className="meta-row">
            <span className="meta-label">date</span>
            <span className="meta-value">
              {dateStr} · {timeStr} <span style={{ color: "var(--fg-3)" }}>(GMT+9)</span>
            </span>
          </div>
        )}

        {/* discord */}
        <div style={{ marginTop: 16 }} className="fade-up d3">
          <DiscordMeta />
        </div>

      </div>
    </div>
  );
}
