import React from "react";
import { COLORS, GRADIENT, CARD_SHADOW, CARD_SHADOW_LG, STATUS_STYLE, TAG_LABEL, TAG_BADGE_STYLE, TRACKS, toMinutes } from "../scheduleData";

const GRID_TEMPLATE = `90px 90px repeat(${TRACKS.length}, 1fr)`;

export default function ScheduleGrid({ rows, onCellClick, now, stickyTop = 0 }) {
  const clickable = typeof onCellClick === "function";
  const nowMin = now ? now.getHours() * 60 + now.getMinutes() : null;

  function isCurrentRow(row) {
    if (nowMin == null) return false;
    const startMin = toMinutes(row.start);
    let endMin = toMinutes(row.end);
    if (endMin <= startMin) endMin += 24 * 60;
    return nowMin >= startMin && nowMin < endMin;
  }

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
      <style>{`
        @keyframes smetec-row-glow {
          0%, 100% { box-shadow: 0 0 0 0 ${COLORS.nowRowGlow}55; transform: scale(1); }
          50% { box-shadow: 0 0 26px 6px ${COLORS.nowRowGlow}55; transform: scale(1.008); }
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
        <div role="columnheader" style={thStyle}>Start</div>
        <div role="columnheader" style={thStyle}>End</div>
        {TRACKS.map((t) => (
          <div key={t} role="columnheader" style={thStyle}>{t}</div>
        ))}
      </div>

      <div style={{ padding: 6, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, overflow: "hidden" }}>
        {rows.map((row) => {
          const highlight = isCurrentRow(row);
          return (
            <RowWrapper key={row.id} highlight={highlight}>
              {row.type === "merged" ? (
                <div role="row" style={{ display: "grid", gridTemplateColumns: GRID_TEMPLATE, gap: 6, position: "relative", zIndex: 0, isolation: "isolate" }}>
                  <div role="cell" style={tdTimeStyle}>{row.start}</div>
                  <div role="cell" style={tdTimeStyle}>{row.end}</div>
                  <div
                    role="cell"
                    style={{
                      ...tdStyle,
                      gridColumn: `3 / span ${TRACKS.length}`,
                      background: cellBackground(row.status),
                      boxShadow: cellShadow(row.status),
                      filter: cellFilter(row.status),
                    }}
                  >
                    <StatusCell
                      title={row.title}
                      status={row.status}
                      tag={row.tag}
                      presenters={row.presenters}
                      clickable={clickable}
                      onClick={clickable ? () => onCellClick(row.id) : undefined}
                      align="center"
                    />
                  </div>
                </div>
              ) : (
                <div role="row" style={{ display: "grid", gridTemplateColumns: GRID_TEMPLATE, gap: 6, position: "relative", zIndex: 0, isolation: "isolate" }}>
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
                          background: cellBackground(cell.status),
                          boxShadow: cellShadow(cell.status),
                          filter: cellFilter(cell.status),
                        }}
                      >
                        <StatusCell
                          title={cell.title}
                          status={cell.status}
                          tag={cell.tag}
                          presenters={cell.presenters}
                          clickable={clickable}
                          onClick={clickable ? () => onCellClick(`${row.id}-${track}`) : undefined}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </RowWrapper>
          );
        })}
      </div>
    </div>
  );
}

function cellBackground(status) {
  if (status === "now") return COLORS.now;
  if (status === "ended") return COLORS.ended;
  return COLORS.cardBg;
}

function cellShadow(status) {
  if (status === "now") return `0 4px 16px ${COLORS.now}66`;
  return CARD_SHADOW;
}

function cellFilter(status) {
  return status === "ended" ? "grayscale(1) opacity(0.5)" : "none";
}

function RowWrapper({ highlight, children }) {
  if (!highlight) {
    return <div style={{ marginBottom: 6 }}>{children}</div>;
  }
  return (
    <div
      style={{
        marginBottom: 6,
        borderRadius: 14,
        padding: 0,
        animation: "smetec-row-glow 1.8s ease-in-out infinite",
      }}
    >
      {children}
    </div>
  );
}

function CategoryBadge({ tag, align }) {
  if (!tag) return null;
  const style = TAG_BADGE_STYLE[tag];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 10,
        fontWeight: 700,
        color: style.fg,
        background: style.bg,
        borderRadius: 6,
        padding: "3px 8px",
        letterSpacing: 0.3,
        marginBottom: 8,
        width: "fit-content",
        alignSelf: align === "center" ? "center" : "flex-start",
      }}
    >
      {TAG_LABEL[tag].toUpperCase()}
    </span>
  );
}

function PersonGlyph({ color }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="7.5" r="4" />
      <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  );
}

function PresenterPill({ name, isNow }) {
  const color = isNow ? "#FFFFFF" : COLORS.subtle;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "flex-start",
        gap: 5,
        fontSize: 11,
        fontWeight: 500,
        color,
        lineHeight: 1.3,
      }}
    >
      <span style={{ marginTop: 1.5 }}><PersonGlyph color={color} /></span>
      {name}
    </span>
  );
}

function StatusCell({ title, status, tag, presenters, clickable, onClick, align }) {
  const isNow = status === "now";
  const pill = isNow ? { bg: "#FFFFFF", fg: STATUS_STYLE.now.fg } : STATUS_STYLE[status];
  const hasPresenters = Array.isArray(presenters) && presenters.length > 0;

  const statusPill = (
    <div
      style={{
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
        flexShrink: 0,
      }}
    >
      {status.toUpperCase()}
    </div>
  );

  const presenterRow = hasPresenters && (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 3,
        width: "100%",
      }}
    >
      {presenters.map((name) => (
        <PresenterPill key={name} name={name} isNow={isNow} />
      ))}
    </div>
  );

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        height: "100%",
        width: "100%",
        minHeight: 64,
        boxSizing: "border-box",
        padding: align === "center" ? "12px 18px" : "12px 14px 14px 18px",
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
      <CategoryBadge tag={tag} align={align} />

      <div
        style={{
          fontSize: 13.5,
          lineHeight: 1.35,
          color: isNow ? "#FFFFFF" : COLORS.ink,
          fontWeight: align === "center" ? 600 : 500,
          textAlign: align === "center" ? "center" : "left",
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: align === "center" ? "center" : "flex-start",
          gap: 6,
          marginTop: align === "center" ? 8 : "auto",
          paddingTop: align === "center" ? 0 : 8,
          width: "100%",
        }}
      >
        {presenterRow}
        {statusPill}
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