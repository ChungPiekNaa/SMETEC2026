import React, { useEffect, useState } from "react";
import { subscribe } from "../lib/scheduleStore";
import ScheduleGrid from "../components/ScheduleGrid";
import PageHeader from "../components/PageHeader";
import ScheduleSkeleton from "../components/ScheduleSkeleton";

export default function PublicPage() {
  const [rows, setRows] = useState(null);
  const [now, setNow] = useState(new Date());
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

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", background: "#EEF0F2", padding: "20px", minHeight: "100vh" }}>
      <div style={{ background: "#fff", border: "1px solid #111", maxWidth: 1400, margin: "0 auto", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
        <PageHeader now={now} />

        <div style={{ padding: "8px 24px 0", fontSize: 11, color: connectionError ? "#C0392B" : "#8A8F98" }}>
          {connectionError
            ? "Connection lost — trying to reconnect…"
            : rows
              ? "Live — updates automatically as the organiser marks sessions."
              : "Loading the latest schedule…"}
        </div>

        <div style={{ padding: "12px 24px 24px" }}>
          {rows ? <ScheduleGrid rows={rows} /> : <ScheduleSkeleton />}
        </div>
      </div>
    </div>
  );
}
