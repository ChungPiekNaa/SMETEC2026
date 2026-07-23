import React from "react";

export default function FnbNote() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "#FFF4E0",
        border: "1px solid #F0C36D",
        color: "#8A5A00",
        borderRadius: 999,
        padding: "3px 12px 3px 8px",
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <path d="M7 2v8a2 2 0 0 0 2 2v10M7 2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2M7 2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M17 2c-1.5 0-3 1.5-3 4v5c0 1.5 1 2 2 2v9M17 2v20" stroke="#8A5A00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Batang Ai — F&amp;B
    </span>
  );
}
