import React, { useEffect, useState } from "react";
import { subscribe, saveSessions } from "../lib/scheduleStore";
import { STATUS } from "../scheduleData";
import ScheduleGrid from "../components/ScheduleGrid";
import PageHeader from "../components/PageHeader";
import ScheduleSkeleton from "../components/ScheduleSkeleton";
import FnbNote from "../components/FnbNote";

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
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: "#EEF0F2", padding: "20px", minHeight: "100vh" }}>
      <div style={{ background: "#fff", border: "1px solid #111", maxWidth: 1400, margin: "0 auto", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        {/* Header renders immediately because it doesn't depend on the schedule
            data, so the page never shows a blank screen while data loads */}
        <PageHeader
          now={now}
          badge={
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "#1B7FBF", borderRadius: 4, padding: "2px 8px", marginLeft: 10, verticalAlign: "middle" }}>
              ADMIN
            </span>
          }
        />

        <div style={{ padding: "8px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: connectionError ? "#C0392B" : "#6B7684" }}>
            {connectionError
              ? "Connection lost — trying to reconnect…"
              : rows
                ? "Click a session to move it Upcoming → Now → Ended. Attendees see it instantly."
                : "Loading the latest schedule…"}
            {saving ? "  Saving…" : ""}
          </span>
          <FnbNote />
        </div>

        <div style={{ padding: "12px 24px 24px" }}>
          {rows ? <ScheduleGrid rows={rows} onCellClick={handleCellClick} /> : <ScheduleSkeleton />}
        </div>
      </div>
    </div>
  );
}
