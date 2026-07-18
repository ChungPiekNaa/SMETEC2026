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
        <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 0.5, lineHeight: 1, color: "#1B5FA8" }}>
          SMETEC 2026
          {badge}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1F2933", marginTop: 8 }}>
          Sarawak Energy SME Technical Conference
        </div>
        <div style={{ fontSize: 12.5, color: "#6B7684", marginTop: 2 }}>
          Empowering Innovation: Driving the Future of Sustainable Energy
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
