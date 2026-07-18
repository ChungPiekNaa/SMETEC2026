import React from "react";
import { COLORS, TRACKS } from "../scheduleData";

const shimmer = "smetec-skeleton-shimmer";

export default function ScheduleSkeleton() {
  return (
    <div style={{ overflowX: "auto" }}>
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
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 1100, tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={thStyle}>Time Start</th>
            <th style={thStyle}>Time End</th>
            {TRACKS.map((t) => <th key={t} style={thStyle}>{t}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i}>
              <td style={tdStyle}><div className={shimmer} style={{ height: 14, width: 50, borderRadius: 3 }} /></td>
              <td style={tdStyle}><div className={shimmer} style={{ height: 14, width: 50, borderRadius: 3 }} /></td>
              {TRACKS.map((t) => (
                <td key={t} style={{ ...tdStyle, height: 64 }}>
                  <div className={shimmer} style={{ height: 12, width: "90%", borderRadius: 3, marginBottom: 6 }} />
                  <div className={shimmer} style={{ height: 12, width: "60%", borderRadius: 3 }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  background: COLORS.headerBlue,
  color: "#fff",
  textAlign: "left",
  fontSize: 13,
  fontWeight: 700,
  padding: "10px 14px",
  borderBottom: `2px solid ${COLORS.hairline}`,
};

const tdStyle = {
  border: "1px solid #ddd",
  verticalAlign: "top",
  padding: "12px 14px",
};
