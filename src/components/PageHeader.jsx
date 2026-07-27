import React from "react";
import { COLORS, CARD_SHADOW_LG } from "../scheduleData";
import LegendPanel from "./LegendPanel";
import AnnouncementBanner from "./AnnouncementBanner";

export default function PageHeader({ now, badge }) {
  return (
    <div>
      <style>{`
        .smetec-ph-row {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          gap: clamp(10px, 3vw, 24px);
          padding: clamp(10px, 3vw, 20px) clamp(12px, 4vw, 24px);
          flex-wrap: wrap;
        }
        .smetec-ph-left {
          min-width: 0;
          flex: 3 1 340px;
          max-width: 600px;
        }
        .smetec-ph-logo-wrap {
          position: relative;
          display: block;
          width: 100%;
        }
        .smetec-ph-logo-card {
          background: ${COLORS.cardBg};
          border-radius: clamp(8px, 1.5vw, 16px);
          padding: clamp(6px, 1.5vw, 12px) clamp(8px, 2vw, 16px);
          box-shadow: ${CARD_SHADOW_LG};
          display: block;
          width: 100%;
          box-sizing: border-box;
        }
        .smetec-ph-logo-img {
          display: block;
          width: 100%;
          height: auto;
        }
        .smetec-ph-badge {
          position: absolute;
          top: clamp(-6px, -1vw, -4px);
          right: clamp(-10px, -6vw, -70px);
          transform: scale(clamp(0.75, 1.4vw, 1));
          transform-origin: top right;
        }
        .smetec-ph-now {
          font-size: clamp(9.5px, 1.6vw, 11px);
          color: ${COLORS.subtle};
          margin-top: clamp(6px, 1.5vw, 14px);
        }
        .smetec-ph-now-value {
          font-weight: 600;
          color: ${COLORS.ink};
          font-size: clamp(11px, 1.8vw, 13px);
        }
        .smetec-ph-right {
          flex: 2 1 300px;
          max-width: 620px;
          display: flex;
          flex-direction: column;
          gap: clamp(6px, 1.5vw, 10px);
          container-type: inline-size;
        }
        @media (max-width: 720px) {
          .smetec-ph-row {
            flex-direction: column;
            align-items: stretch;
          }
          .smetec-ph-left {
            width: 100%;
            max-width: none;
            flex: 0 0 auto;
          }
          .smetec-ph-right {
            width: 100%;
            max-width: 100%;
            flex: 0 0 auto;
          }
        }
      `}</style>

      <div className="smetec-ph-row">
        <div className="smetec-ph-left">
          <div className="smetec-ph-logo-wrap">
            <div className="smetec-ph-logo-card">
              <img
                className="smetec-ph-logo-img"
                src="/smetec2026.png"
                alt="SMETEC 2026 — Sarawak Energy SME Technical Conference — Empowering Innovation: Driving the Future of Sustainable Energy"
              />
            </div>
            {badge && <span className="smetec-ph-badge">{badge}</span>}
          </div>
          <div className="smetec-ph-now">
            Now
            <div className="smetec-ph-now-value">
              {now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}, {now.toLocaleTimeString("en-GB", { hour12: false })}
            </div>
          </div>
        </div>

        <div className="smetec-ph-right">
          <LegendPanel />
          <AnnouncementBanner now={now} />
        </div>
      </div>

      <div style={{ borderBottom: `1px solid #E1E5EA` }} />
    </div>
  );
}