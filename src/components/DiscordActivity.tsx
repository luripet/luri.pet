"use client";

import { useLanyard } from "@/hooks/useLanyard";
import type { Activity } from "@/types/lanyard";
import { useEffect, useState } from "react";

/* ── helpers ────────────────────────────────────────────────── */

const STATUS_COLOR: Record<string, string> = {
  online:  "#3ba55d",
  idle:    "#faa61a",
  dnd:     "#ed4245",
  offline: "#747f8d",
};

function fmtMs(ms: number): string {
  const t = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(t / 60);
  const s = t % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function getImageUrl(a: Activity): string | null {
  const img = a.assets?.large_image;
  if (!img) return null;
  if (img.startsWith("mp:external/"))
    return `https://media.discordapp.net/external/${img.slice(12)}`;
  if (a.application_id)
    return `https://cdn.discordapp.com/app-assets/${a.application_id}/${img}.png`;
  return null;
}

/* ── SpotifyProgress ────────────────────────────────────────── */

function SpotifyProgress({ start, end }: { start: number; end: number }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsed  = Math.max(0, now - start);
  const duration = end - start;
  const pct      = Math.min(100, (elapsed / duration) * 100);

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 2, borderRadius: 1, background: "rgba(29,185,84,0.18)", overflow: "hidden", marginBottom: 4 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "#1DB954", borderRadius: 1, transition: "width 0.95s linear" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>
        <span>{fmtMs(elapsed)}</span>
        <span>{fmtMs(duration)}</span>
      </div>
    </div>
  );
}

/* ── ActivityCard ───────────────────────────────────────────── */

function ActivityCard({ a }: { a: Activity }) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!a.timestamps?.start) return;
    const id = setInterval(() => tick(n => n + 1), 1000);
    return () => clearInterval(id);
  }, [a.timestamps?.start]);

  const img  = getImageUrl(a);
  const time = a.timestamps?.start ? fmtMs(Date.now() - a.timestamps.start) : null;

  return (
    <div className="act-card">
      {img && (
        <img src={img} alt={a.assets?.large_text ?? a.name} width={36} height={36}
          style={{ borderRadius: 6, flexShrink: 0, objectFit: "cover" }} />
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {a.name}
        </p>
        {a.details && (
          <p style={{ fontSize: 12, color: "var(--fg-2)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.details}
          </p>
        )}
        {a.state && (
          <p style={{ fontSize: 12, color: "var(--fg-3)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {a.state}
          </p>
        )}
        {time && (
          <p style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>
            {time} elapsed
          </p>
        )}
      </div>
    </div>
  );
}

/* ── useBioLine — one-liner for the header area ─────────────── */

export function useBioLine(): string | null {
  const { presence } = useLanyard();
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick(n => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (!presence) return null;
  if (presence.listening_to_spotify && presence.spotify) {
    const { song, artist, timestamps } = presence.spotify;
    const e = fmtMs(Date.now() - timestamps.start);
    const t = fmtMs(timestamps.end - timestamps.start);
    return `Listening to ${song} by ${artist} — ${e} / ${t}`;
  }
  const act = presence.activities.find(a => a.type !== 4);
  if (act) return `Playing ${act.name}`;
  return null;
}

/* ── DiscordMeta — the meta rows for the page ───────────────── */

export function DiscordMeta() {
  const { presence } = useLanyard();
  if (!presence) return null;

  const activities = presence.activities.filter(a => a.type !== 4);
  const hasActivity = presence.listening_to_spotify || activities.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Spotify */}
      {presence.listening_to_spotify && presence.spotify && (
        <>
          <div className="meta-row">
            <span className="meta-label">listening to</span>
            <span className="meta-value">
              <strong>{presence.spotify.song}</strong> by {presence.spotify.artist}
            </span>
          </div>
          <div className="meta-row" style={{ marginTop: 8 }}>
            {/* inline progress bar instead of a separate section */}
            <span className="meta-label" />
            <div style={{ flex: 1, maxWidth: 220 }}>
              {presence.spotify.album_art_url && (
                <img src={presence.spotify.album_art_url} alt={presence.spotify.album}
                  width={32} height={32}
                  style={{ borderRadius: 4, display: "block", marginBottom: 6, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }} />
              )}
              <SpotifyProgress
                start={presence.spotify.timestamps.start}
                end={presence.spotify.timestamps.end}
              />
            </div>
          </div>
        </>
      )}

      {/* Other activities */}
      {!presence.listening_to_spotify && hasActivity && activities.map(a => (
        <div key={a.id} style={{ marginTop: 4 }}>
          <ActivityCard a={a} />
        </div>
      ))}

      {/* No activity */}
      {!hasActivity && (
        <div className="meta-row">
          <span className="meta-label">activity</span>
          <span className="meta-value">Nothing right now</span>
        </div>
      )}
    </div>
  );
}

/* ── Avatar with status dot ─────────────────────────────────── */

export function Avatar() {
  const { presence } = useLanyard();
  const status = presence?.discord_status ?? "offline";
  const color  = STATUS_COLOR[status] ?? STATUS_COLOR.offline;

  return (
    <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
      <img
        src="/icon.png"
        alt="luripet"
        width={52}
        height={52}
        style={{ borderRadius: "50%", objectFit: "cover", display: "block" }}
      />
      {presence && (
        <span style={{
          position: "absolute", bottom: 1, right: 0,
          width: 12, height: 12, borderRadius: "50%",
          background: color,
          border: "2px solid var(--dot-ring)",
          boxShadow: `0 0 5px ${color}77`,
          animation: status === "online" ? "blink 2.2s ease-in-out infinite" : undefined,
        }} />
      )}
    </div>
  );
}
