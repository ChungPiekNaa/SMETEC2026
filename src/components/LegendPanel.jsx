import React from "react";
import { COLORS, STATUS, STATUS_LABEL, STATUS_COLOR, TAG_LABEL, TAG_COLOR } from "../scheduleData";

export default function LegendPanel() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
      <div style={{ flex: "1 1 260px", maxWidth: 300, border: "1px solid #ccc" }}>
        <div style={{ background: COLORS.panelGrey, color: "#fff", padding: "7px 14px", fontWeight: 700, fontSize: 13 }}>
          Legend
        </div>
        <div style={{ padding: "8px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
          {Object.entries(TAG_LABEL).map(([k, v]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
              <span style={{ width: 16, height: 16, background: TAG_COLOR[k], display: "inline-block", border: "1px solid rgba(0,0,0,0.15)", flexShrink: 0 }} />
              {v}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: "1 1 180px", maxWidth: 200, border: "1px solid #ccc" }}>
        <div style={{ background: COLORS.panelGrey, color: "#fff", padding: "7px 14px", fontWeight: 700, fontSize: 13 }}>
          Status
        </div>
        <div style={{ padding: "8px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
          {STATUS.map((s) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
              <span style={{ width: 16, height: 16, background: STATUS_COLOR[s], display: "inline-block", border: "1px solid rgba(0,0,0,0.15)", flexShrink: 0 }} />
              {STATUS_LABEL[s]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
