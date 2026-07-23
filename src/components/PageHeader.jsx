import React from "react";
import LegendPanel from "./LegendPanel";

export default function PageHeader({ now, badge }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 24,
        padding: "20px 24px",
        borderBottom: "1px solid #ddd",
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 260 }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src="/smetec2026.png"
            alt="SMETEC 2026 — Sarawak Energy SME Technical Conference — Empowering Innovation: Driving the Future of Sustainable Energy"
            style={{ display: "block", maxHeight: 220, width: "auto" }}
          />
          {badge && (
            <span style={{ position: "absolute", top: -6, right: -70 }}>{badge}</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "#6B7684", marginTop: 14 }}>
          Now
          <div style={{ fontWeight: 600, color: "#1F2933", fontSize: 13 }}>
            {now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}, {now.toLocaleTimeString("en-GB", { hour12: false })}
          </div>
        </div>
      </div>

      <div style={{ flex: "0 1 560px" }}>
        <LegendPanel />
      </div>
    </div>
  );
}
