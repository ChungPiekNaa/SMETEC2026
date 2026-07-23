import React from "react";
import { COLORS, STATUS_LABEL, STATUS_COLOR, TAG_COLOR, TRACKS } from "../scheduleData";

export default function ScheduleGrid({ rows, onCellClick }) {
  const clickable = typeof onCellClick === "function";

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 1100, tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: 90 }} />
          <col style={{ width: 90 }} />
          {TRACKS.map((t) => <col key={t} />)}
        </colgroup>
        <thead>
          <tr>
            <th style={thStyle}>Time Start</th>
            <th style={thStyle}>Time End</th>
            {TRACKS.map((t) => (
              <th key={t} style={thStyle}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
            row.type === "merged" ? (
              <tr key={row.id}>
                <td style={tdTimeStyle}>{row.start}</td>
                <td style={tdTimeStyle}>{row.end}</td>
                <td colSpan={TRACKS.length} style={{ ...tdStyle, padding: 0, background: row.tag ? TAG_COLOR[row.tag] : "#ffffff" }}>
                  <StatusCell
                    title={row.title}
                    status={row.status}
                    clickable={clickable}
                    onClick={clickable ? () => onCellClick(row.id) : undefined}
                    align="center"
                  />
                </td>
              </tr>
            ) : (
              <tr key={row.id}>
                <td style={tdTimeStyle}>{row.start}</td>
                <td style={tdTimeStyle}>{row.end}</td>
                {TRACKS.map((track) => {
                  const cell = row.tracks[track];
                  if (!cell) return <td key={track} style={{ ...tdStyle, background: "#fff" }}></td>;
                  return (
                    <td key={track} style={{ ...tdStyle, padding: 0, background: cell.tag ? TAG_COLOR[cell.tag] : "#ffffff" }}>
                      <StatusCell
                        title={cell.title}
                        status={cell.status}
                        clickable={clickable}
                        onClick={clickable ? () => onCellClick(`${row.id}-${track}`) : undefined}
                      />
                    </td>
                  );
                })}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusCell({ title, status, clickable, onClick, align }) {
  const barColor = STATUS_COLOR[status];
  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        minHeight: 64,
        boxSizing: "border-box",
        padding: align === "center" ? "12px 18px" : "12px 14px 34px 18px",
        cursor: clickable ? "pointer" : "default",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        justifyContent: align === "center" ? "center" : "flex-start",
        alignItems: align === "center" ? "center" : "stretch",
      }}
      title={clickable ? "Click to change status" : undefined}
    >
      
      <div
        style={{
          fontSize: 13.5,
          lineHeight: 1.35,
          color: COLORS.ink,
          fontWeight: align === "center" ? 600 : 500,
          textAlign: align === "center" ? "center" : "left",
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: align === "center" ? "static" : "absolute",
          left: align === "center" ? undefined : 18,
          bottom: align === "center" ? undefined : 12,
          marginTop: align === "center" ? 8 : 0,
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 10.5,
          fontWeight: 700,
          color: "#fff",
          background: barColor,
          borderRadius: 4,
          padding: "2px 8px",
          letterSpacing: 0.3,
        }}
      >
        {STATUS_LABEL[status].toUpperCase()}
      </div>
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
};

const tdTimeStyle = {
  ...tdStyle,
  background: "#ffffff",
  padding: "12px 14px",
  fontSize: 13.5,
  fontWeight: 600,
  color: COLORS.ink,
  whiteSpace: "nowrap",
};