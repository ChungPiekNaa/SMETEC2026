import React from "react";
import { getActiveAnnouncement } from "../scheduleData";

// Clean, minimal line icons drawn as inline SVG — no external icon-font or package dependency required
const ICON_PATHS = {
  arrival: (
    <>
      <path d="M13 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
      <polyline points="9 8 14 12 9 16" />
      <line x1="2" y1="12" x2="14" y2="12" />
    </>
  ),
  briefing: (
    <>
      <path d="M12 1.5a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0v-7a3 3 0 0 0-3-3z" />
      <path d="M18.5 10v1.5a6.5 6.5 0 0 1-13 0V10" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="8.5" y1="22" x2="15.5" y2="22" />
    </>
  ),
  photo: (
    <>
      <path d="M22 18.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.5l1.8-2.5h5.4L16.5 6H20a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="3.6" />
    </>
  ),
  aivision: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
      <rect x="9.75" y="9.75" width="4.5" height="4.5" />
      <line x1="9.5" y1="1.5" x2="9.5" y2="4" />
      <line x1="14.5" y1="1.5" x2="14.5" y2="4" />
      <line x1="9.5" y1="20" x2="9.5" y2="22.5" />
      <line x1="14.5" y1="20" x2="14.5" y2="22.5" />
      <line x1="20" y1="9.5" x2="22.5" y2="9.5" />
      <line x1="20" y1="14.5" x2="22.5" y2="14.5" />
      <line x1="1.5" y1="9.5" x2="4" y2="9.5" />
      <line x1="1.5" y1="14.5" x2="4" y2="14.5" />
    </>
  ),
  drone: (
    <>
      <circle cx="4.5" cy="4.5" r="1.8" />
      <circle cx="19.5" cy="4.5" r="1.8" />
      <circle cx="4.5" cy="19.5" r="1.8" />
      <circle cx="19.5" cy="19.5" r="1.8" />
      <line x1="5.8" y1="5.8" x2="9.8" y2="9.8" />
      <line x1="18.2" y1="5.8" x2="14.2" y2="9.8" />
      <line x1="5.8" y1="18.2" x2="9.8" y2="14.2" />
      <line x1="18.2" y1="18.2" x2="14.2" y2="14.2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
    </>
  ),
  luckydraw: (
    <>
      <polyline points="20.5 11 20.5 21.5 3.5 21.5 3.5 11" />
      <rect x="1.5" y="6.5" width="21" height="4.5" />
      <line x1="12" y1="21.5" x2="12" y2="6.5" />
      <path d="M12 6.5H7.8a2.3 2.3 0 0 1 0-4.5c3.2 0 4.2 4.5 4.2 4.5z" />
      <path d="M12 6.5h4.2a2.3 2.3 0 0 0 0-4.5c-3.2 0-4.2 4.5-4.2 4.5z" />
    </>
  ),
};

function Icon({ name, color = "#fff" }) {
  const paths = ICON_PATHS[name];
  if (!paths) return null;
  return (
    <svg
      className="smetec-ab-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths}
    </svg>
  );
}

export default function AnnouncementBanner({ now }) {
  const announcement = getActiveAnnouncement(now);
  if (!announcement) return null;

  const { message, icon, accent, start, end } = announcement;

  return (
    <div
      className="smetec-ab"
      style={{
        background: `linear-gradient(120deg, ${accent}14 0%, #FFFFFF 55%, ${accent}0D 100%)`,
        boxShadow: `0 8px 22px ${accent}26, 0 1px 3px rgba(16,24,40,0.06)`,
        "--glow": `${accent}40`,
        animation: "smetec-announce-pulse 2.6s ease-in-out infinite",
      }}
    >
      <div
        className="smetec-ab-avatar"
        style={{
          background: `linear-gradient(135deg, ${accent}, ${accent}CC)`,
          boxShadow: `0 4px 12px ${accent}55`,
        }}
      >
        <Icon name={icon} />
      </div>

      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <div className="smetec-ab-time" style={{ color: accent }}>
          {start} – {end}
        </div>
        <div className="smetec-ab-message">{message}</div>
      </div>

      <style>{`
        @keyframes smetec-announce-pulse {
          0%, 100% { box-shadow: 0 8px 22px var(--glow), 0 1px 3px rgba(16,24,40,0.06); }
          50% { box-shadow: 0 10px 30px var(--glow), 0 1px 3px rgba(16,24,40,0.06); }
        }
        .smetec-ab {
          margin-top: clamp(6px, 1.5vw, 10px);
          padding: clamp(10px, 2.2vw, 16px) clamp(12px, 3vw, 22px);
          border-radius: clamp(10px, 2vw, 18px);
          border: none;
          display: flex;
          align-items: center;
          gap: clamp(10px, 2vw, 16px);
        }
        .smetec-ab-avatar {
          flex: 0 0 auto;
          width: clamp(34px, 6vw, 50px);
          height: clamp(34px, 6vw, 50px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .smetec-ab-icon {
          width: 55%;
          height: 55%;
        }
        .smetec-ab-time {
          font-size: clamp(9.5px, 1.6vw, 11.5px);
          font-weight: 700;
          letter-spacing: 0.6px;
          margin-bottom: 3px;
        }
        .smetec-ab-message {
          font-size: clamp(12.5px, 2.2vw, 18px);
          font-weight: 700;
          color: #1F2933;
          line-height: 1.25;
          letter-spacing: 0.1px;
        }
      `}</style>
    </div>
  );
}