import React, { useEffect, useState } from "react";
import { subscribe, saveSessions } from "../lib/scheduleStore";
import { STATUS, COLORS, GRADIENT, PILL_SHADOW, CARD_SHADOW_LG } from "../scheduleData";
import ScheduleGrid from "../components/ScheduleGrid";
import PageHeader from "../components/PageHeader";
import ScheduleSkeleton from "../components/ScheduleSkeleton";

function nextStatus(current) {
  const idx = STATUS.indexOf(current);
  return STATUS[(idx + 1) % STATUS.length];
}

function applyStatusChange(rows, clickedId) {
  return rows.map((row) => {
    if (row.type === "merged") {
      if (row.id !== clickedId) return row;
      return { ...row, status: nextStatus(row.status) };
    }
    const track = Object.keys(row.tracks).find((t) => `${row.id}-${t}` === clickedId);
    if (!track) return row;
    return {
      ...row,
      tracks: {
        ...row.tracks,
        [track]: { ...row.tracks[track], status: nextStatus(row.tracks[track].status) },
      },
    };
  });
}

export default function AdminPage() {
  const [rows, setRows] = useState(null);
  const [now, setNow] = useState(new Date());
  const [saving, setSaving] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(
      (next) => { setRows(next); setConnectionError(false); },
      () => setConnectionError(true)
    );
    return unsubscribe;
  }, []);

  const handleCellClick = async (clickedId) => {
    const next = applyStatusChange(rows, clickedId);
    setRows(next); 
    setSaving(true);
    try {
      await saveSessions(next);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="smetec-page-shell" style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: COLORS.pageBg }}>
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          background: ${COLORS.pageBg};
        }
        .smetec-page-shell {
          box-sizing: border-box;
          padding: clamp(0px, 2vw, 20px);
          height: 100dvh;
          width: 100%;
        }
        .smetec-page-card {
          background: ${COLORS.cardBg};
          border-radius: clamp(0px, 2vw, 20px);
          max-width: 1400px;
          margin: 0 auto;
          box-shadow: ${CARD_SHADOW_LG};
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .smetec-page-statusbar {
          padding: clamp(6px, 1.5vw, 8px) clamp(12px, 4vw, 24px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .smetec-page-scroll {
          flex: 1 1 auto;
          overflow: auto;
          padding: 0 clamp(12px, 4vw, 24px) clamp(12px, 4vw, 24px);
        }
        @media (max-width: 640px) {
          .smetec-page-shell { padding: 0; }
          .smetec-page-card { border-radius: 0; box-shadow: none; }
        }
      `}</style>

      <div className="smetec-page-card">
        <div style={{ flex: "0 0 auto", background: COLORS.cardBg, position: "relative", zIndex: 5, boxShadow: scrolled ? "0 4px 14px rgba(16,24,40,0.08)" : "none", transition: "box-shadow 0.15s ease" }}>
          <PageHeader
            now={now}
            badge={
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", background: GRADIENT, borderRadius: 20, padding: "4px 12px", marginLeft: 10, verticalAlign: "middle", boxShadow: PILL_SHADOW }}>
                ADMIN
              </span>
            }
          />

          <div className="smetec-page-statusbar">
            <span style={{ fontSize: 11, color: connectionError ? "#C0392B" : COLORS.subtle }}>
              {connectionError
                ? "Connection lost — trying to reconnect…"
                : rows
                  ? "Click a session to move it Upcoming → Now → Ended. Attendees see it instantly."
                  : "Loading the latest schedule…"}
              {saving ? "  Saving…" : ""}
            </span>
          </div>
        </div>

        <div
          className="smetec-page-scroll"
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 2)}
        >
          {rows ? <ScheduleGrid rows={rows} onCellClick={handleCellClick} stickyTop={0} /> : <ScheduleSkeleton stickyTop={0} />}
        </div>
      </div>
    </div>
  );
}