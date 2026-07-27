import React from "react";
import { COLORS, PILL_SHADOW, TAG_LABEL, TAG_COLOR } from "../scheduleData";

export default function LegendPanel() {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" }}>
      {Object.entries(TAG_LABEL).map(([k, v]) => (
        <div
          key={k}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11.5,
            fontWeight: 500,
            color: "#4B5563",
            background: COLORS.cardBg,
            borderRadius: 20,
            boxShadow: PILL_SHADOW,
            padding: "4px 12px 4px 8px",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: 3, background: TAG_COLOR[k], display: "inline-block", flexShrink: 0 }} />
          {v}
        </div>
      ))}
    </div>
  );
}