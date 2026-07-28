import React from "react";
import { COLORS, GRADIENT, CARD_SHADOW, CARD_SHADOW_LG, STATUS_STYLE, TAG_COLOR, TRACKS } from "../scheduleData";

const GRID_TEMPLATE = `90px 90px repeat(${TRACKS.length}, 1fr)`;

export default function ScheduleGrid({ rows, onCellClick, stickyTop = 0 }) {
  const clickable = typeof onCellClick === "function";

  return (
    <div
      role="table"
      style={{
        minWidth: 1100,
        borderRadius: 16,
        boxShadow: CARD_SHADOW_LG,
        background: COLORS.pageBg,
      }}
    >
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
        {TRACKS.map((t) => (
          <div key={t} role="columnheader" style={thStyle}>{t}</div>
        ))}
      </div>

      <div style={{ padding: 6, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, overflow: "hidden" }}>
        {rows.map((row) =>
          row.type === "merged" ? (
            <div key={row.id} role="row" style={{ display: "grid", gridTemplateColumns: GRID_TEMPLATE, gap: 6, marginBottom: 6, position: "relative", zIndex: 0, isolation: "isolate" }}>
              <div role="cell" style={tdTimeStyle}>{row.start}</div>
              <div role="cell" style={tdTimeStyle}>{row.end}</div>
              <div
                role="cell"
                style={{
                  ...tdStyle,
                  gridColumn: `3 / span ${TRACKS.length}`,
                  background: row.tag ? TAG_COLOR[row.tag] : COLORS.mergedBg,
                  filter: row.status === "ended" ? "grayscale(0.75) opacity(0.6)" : "none",
                }}
              >
                <StatusCell
                  title={row.title}
                  status={row.status}
                  clickable={clickable}
                  onClick={clickable ? () => onCellClick(row.id) : undefined}
                  align="center"
                />
              </div>
            </div>
          ) : (
            <div key={row.id} role="row" style={{ display: "grid", gridTemplateColumns: GRID_TEMPLATE, gap: 6, marginBottom: 6, position: "relative", zIndex: 0, isolation: "isolate" }}>
              <div role="cell" style={tdTimeStyle}>{row.start}</div>
              <div role="cell" style={tdTimeStyle}>{row.end}</div>
              {TRACKS.map((track) => {
                const cell = row.tracks[track];
                if (!cell) return <div key={track} role="cell" style={{ ...tdStyle, background: "transparent", boxShadow: "none" }} />;
                return (
                  <div
                    key={track}
                    role="cell"
                    style={{
                      ...tdStyle,
                      background: cell.tag ? TAG_COLOR[cell.tag] : COLORS.cardBg,
                      filter: cell.status === "ended" ? "grayscale(0.75) opacity(0.6)" : "none",
                    }}
                  >
                    <StatusCell
                      title={cell.title}
                      status={cell.status}
                      clickable={clickable}
                      onClick={clickable ? () => onCellClick(`${row.id}-${track}`) : undefined}
                    />
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

function StatusCell({ title, status, clickable, onClick, align }) {
  const pill = STATUS_STYLE[status];
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
        transition: "transform 0.12s ease",
      }}
      onMouseEnter={(e) => { if (clickable) e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { if (clickable) e.currentTarget.style.transform = "translateY(0)"; }}
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
          color: pill.fg,
          background: pill.bg,
          borderRadius: 20,
          padding: "3px 10px",
          letterSpacing: 0.3,
        }}
      >
        {status.toUpperCase()}
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
  border: "none",
  borderRadius: 12,
  boxShadow: CARD_SHADOW,
  verticalAlign: "top",
  boxSizing: "border-box",
  minHeight: 64,
  overflow: "hidden",
};

const tdTimeStyle = {
  background: "transparent",
  padding: "12px 14px",
  fontSize: 13.5,
  fontWeight: 600,
  color: COLORS.ink,
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "flex-start",
  boxSizing: "border-box",
};