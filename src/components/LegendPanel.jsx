import React from "react";
import { COLORS, STATUS, STATUS_LABEL, STATUS_COLOR, TAG_LABEL } from "../scheduleData";

export default function LegendPanel() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "flex-end" }}>
      <div style={{ flex: "1 1 260px", maxWidth: 300, border: "1px solid #ccc" }}>
        <div style={{ background: COLORS.panelGrey, color: "#fff", padding: "7px 14px", fontWeight: 700, fontSize: 13 }}>
          Legend
        </div>
        <div style={{ padding: "8px 14px", display: "grid", gridTemplateColumns: "26px 1fr", rowGap: 3, fontSize: 12.5 }}>
          {Object.entries(TAG_LABEL).map(([k, v]) => (
            <React.Fragment key={k}>
              <div style={{ fontWeight: 700 }}>{k}</div>
              <div style={{ color: COLORS.ink }}>{v}</div>
            </React.Fragment>
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
              <span style={{ width: 16, height: 16, background: STATUS_COLOR[s], display: "inline-block", border: "1px solid rgba(0,0,0,0.15)" }} />
              {STATUS_LABEL[s]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
