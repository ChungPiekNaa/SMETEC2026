import React from "react";
import { COLORS, GRADIENT, CARD_SHADOW, CARD_SHADOW_LG, TRACKS } from "../scheduleData";

const shimmer = "smetec-skeleton-shimmer";
const GRID_TEMPLATE = `90px 90px repeat(${TRACKS.length}, 1fr)`;

export default function ScheduleSkeleton({ stickyTop = 0 }) {
  return (
    <div role="table" style={{ minWidth: 1100, borderRadius: 16, boxShadow: CARD_SHADOW_LG, background: COLORS.pageBg }}>
      <style>{`
        @keyframes ${shimmer} {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        .${shimmer} {
          background: linear-gradient(90deg, #ECEDEF 25%, #F6F7F8 37%, #ECEDEF 63%);
          background-size: 800px 100%;
          animation: ${shimmer} 1.3s ease-in-out infinite;
        }
      `}</style>

      <div
        role="row"
        style={{
          display: "grid",
          gridTemplateColumns: GRID_TEMPLATE,
          position: "sticky",
          top: stickyTop,
          zIndex: 15,
          background: GRADIENT,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <div role="columnheader" style={thStyle}>Time Start</div>
        <div role="columnheader" style={thStyle}>Time End</div>
        {TRACKS.map((t) => <div key={t} role="columnheader" style={thStyle}>{t}</div>)}
      </div>

      <div style={{ padding: 6, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, overflow: "hidden" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} role="row" style={{ display: "grid", gridTemplateColumns: GRID_TEMPLATE, gap: 6, marginBottom: 6 }}>
            <div role="cell" style={{ ...tdStyle, background: "transparent", boxShadow: "none" }}><div className={shimmer} style={{ height: 14, width: 50, borderRadius: 3 }} /></div>
            <div role="cell" style={{ ...tdStyle, background: "transparent", boxShadow: "none" }}><div className={shimmer} style={{ height: 14, width: 50, borderRadius: 3 }} /></div>
            {TRACKS.map((t) => (
              <div key={t} role="cell" style={{ ...tdStyle, height: 64 }}>
                <div className={shimmer} style={{ height: 12, width: "90%", borderRadius: 3, marginBottom: 6 }} />
                <div className={shimmer} style={{ height: 12, width: "60%", borderRadius: 3 }} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const thStyle = {
  color: "#fff",
  textAlign: "left",
  fontSize: 13,
  fontWeight: 700,
  padding: "12px 14px",
  boxSizing: "border-box",
};

const tdStyle = {
  background: COLORS.cardBg,
  borderRadius: 12,
  boxShadow: CARD_SHADOW,
  boxSizing: "border-box",
  padding: "12px 14px",
  overflow: "hidden",
};