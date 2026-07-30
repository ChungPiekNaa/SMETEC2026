import React, { useEffect, useState } from "react";

export default function NoticeEditor({ value, onSave }) {
  const [draft, setDraft] = useState(value || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(value || "");
  }, [value]);

  const commit = () => {
    onSave(draft.trim());
    setSaved(true);
    window.clearTimeout(commit._t);
    commit._t = window.setTimeout(() => setSaved(false), 1800);
  };

  const isDirty = draft !== (value || "");

  return (
    <div className="smetec-notice-editor">
      <div className="smetec-notice-editor-accent" />
      <div className="smetec-notice-editor-body">
        <div className="smetec-notice-editor-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1B7FBF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          Notice to attendees
        </div>
        <div className="smetec-notice-editor-hint">Press Enter to publish. Leave blank if no announcement.</div>
        <div className="smetec-notice-editor-field">
          <input
            value={draft}
            onChange={(e) => { setDraft(e.target.value); setSaved(false); }}
            onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
            onBlur={commit}
            placeholder="e.g. Lunch has been moved 30 mins earlier"
            className={`smetec-notice-editor-input ${draft.trim() ? "has-value" : ""}`}
          />
          {saved && !isDirty && (
            <span className="smetec-notice-editor-saved">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Saved
            </span>
          )}
        </div>
      </div>

      <style>{`
        .smetec-notice-editor {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 4px 18px rgba(27,127,191,0.10), 0 1px 4px rgba(16,24,40,0.05);
          padding: 12px 14px 12px 16px;
          width: 100%;
          max-width: 420px;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }
        .smetec-notice-editor-accent {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #1B7FBF, #2FC4CE);
        }
        .smetec-notice-editor-body {
          margin-left: 6px;
        }
        .smetec-notice-editor-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #1F2933;
          margin-bottom: 2px;
        }
        .smetec-notice-editor-hint {
          font-size: 10.5px;
          color: #9AA3AF;
          margin-bottom: 10px;
        }
        .smetec-notice-editor-field {
          position: relative;
        }
        .smetec-notice-editor-input {
          width: 100%;
          box-sizing: border-box;
          border: 1.5px solid #DCE6F0;
          border-radius: 10px;
          padding: 9px 88px 9px 12px;
          font-size: 12.5px;
          color: #1F2933;
          outline: none;
          font-family: inherit;
          background: linear-gradient(180deg, #FAFCFF, #F5FAFF);
          transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        .smetec-notice-editor-input.has-value {
          border-color: #8DC63F;
        }
        .smetec-notice-editor-input:focus {
          border-color: #1B7FBF;
          box-shadow: 0 0 0 3px rgba(27,127,191,0.10);
        }
        .smetec-notice-editor-saved {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10.5px;
          font-weight: 700;
          color: #fff;
          background: linear-gradient(120deg, #8DC63F, #6FA82F);
          border-radius: 20px;
          padding: 3px 9px;
          box-shadow: 0 2px 6px rgba(141,198,63,0.4);
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}