import React from "react";

export default function NoticeBanner({ notice }) {
  if (!notice || !notice.trim()) return null;

  return (
    <div className="smetec-notice">
      <svg
        className="smetec-notice-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E8A400"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2a6 6 0 0 0-6 6c0 4.5-2 6-2 6h16s-2-1.5-2-6a6 6 0 0 0-6-6z" />
        <path d="M9.5 20a2.5 2.5 0 0 0 5 0" />
      </svg>
      <div style={{ minWidth: 0 }}>
        <div className="smetec-notice-label">Notice</div>
        <div className="smetec-notice-message">{notice}</div>
      </div>

      <style>{`
        .smetec-notice {
          background: #FFF9E8;
          border-left: 4px solid #E8A400;
          border-radius: 8px;
          padding: clamp(9px, 2vw, 12px) clamp(12px, 3vw, 16px);
          display: inline-flex;
          align-items: flex-start;
          gap: 10px;
          margin-top: clamp(6px, 1.5vw, 10px);
          width: fit-content;
          max-width: 420px;
          box-sizing: border-box;
        }
        .smetec-notice-icon {
          width: clamp(15px, 2.6vw, 17px);
          height: clamp(15px, 2.6vw, 17px);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .smetec-notice-label {
          font-size: clamp(9.5px, 1.6vw, 10.5px);
          font-weight: 700;
          color: #B07C00;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .smetec-notice-message {
          font-size: clamp(12.5px, 2.2vw, 14px);
          font-weight: 600;
          color: #1F2933;
          line-height: 1.4;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}