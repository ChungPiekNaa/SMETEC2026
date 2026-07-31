import React, { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { parseCouponQR, redeemCoupon, subscribeRedemptionStats } from "../lib/scheduleStore";
import { COLORS, GRADIENT, CARD_SHADOW_LG, PILL_SHADOW } from "../scheduleData";

const MEAL_META = {
  breakfast: { label: "Breakfast", accent: "#F2994A", bg: "#FFF3E4", fg: "#B5590B" },
  lunch: { label: "Lunch", accent: COLORS.now, bg: "#EAF7D8", fg: "#4C7A1E" },
};

const STATUS_META = {
  success: { title: "Redeemed successfully", accent: COLORS.now, bg: "#EAF7D8", fg: "#4C7A1E" },
  already: { title: "Already redeemed", accent: "#E8A400", bg: "#FFF6DE", fg: "#8A5E00" },
  invalid: { title: "Not a SMETEC 2026 coupon", accent: "#C0392B", bg: "#FDEDEC", fg: "#C0392B" },
  error: { title: "Couldn't reach the database", accent: "#C0392B", bg: "#FDEDEC", fg: "#C0392B" },
};

const SCANNER_ELEMENT_ID = "smetec-redeem-scanner";
const RESULT_DISPLAY_MS = 2800;
const RESCAN_COOLDOWN_MS = 4000;

function formatTime(date) {
  if (!date) return null;
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function pickPrimaryLens(candidates) {
  if (candidates.length <= 1) return candidates[0] || null;

  const explicit1x = candidates.find((d) => /(^|\D)1x(\D|$)/i.test(d.label));
  if (explicit1x) return explicit1x;

  const filtered = candidates.filter(
    (d) => !/ultra|wide|tele|zoom|0\.5x|2x|3x|5x/i.test(d.label)
  );
  if (filtered.length > 0) return filtered[0];

  return candidates[0];
}

export default function RedeemPage() {
  const scannerElRef = useRef(null);
  const busyRef = useRef(false);
  const lastScanRef = useRef({ code: null, at: 0 });
  const resultTimerRef = useRef(null);

  const [cameras, setCameras] = useState([]);
  const [cameraId, setCameraId] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ breakfast: 0, lunch: 0 });
  const [manualOpen, setManualOpen] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [manualMeal, setManualMeal] = useState("breakfast");
  const [manualError, setManualError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeRedemptionStats(setStats, () => {});
    return unsubscribe;
  }, []);

  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices || !devices.length) {
          setCameraError("No camera found on this device. Use manual entry below.");
          return;
        }

        const backCandidates = devices.filter((d) => /back|rear|environment/i.test(d.label));
        const frontCandidates = devices.filter((d) => /front|user/i.test(d.label));

        const backCamera = pickPrimaryLens(backCandidates);
        const frontCamera = pickPrimaryLens(frontCandidates);

        const filteredCameras = [backCamera, frontCamera].filter(Boolean);

        setCameras(filteredCameras.length ? filteredCameras : devices);

        setCameraId(
          backCamera?.id || filteredCameras[0]?.id || devices[devices.length - 1].id
        );
      })
      .catch(() =>
        setCameraError("Camera access was blocked. Allow camera access, or use manual entry below.")
      );
  }, []);

  const scheduleReset = useCallback(() => {
    window.clearTimeout(resultTimerRef.current);
    resultTimerRef.current = window.setTimeout(() => setResult(null), RESULT_DISPLAY_MS);
  }, []);

  const processCode = useCallback(
    async (rawText) => {
      const now = Date.now();
      if (busyRef.current) return;
      if (lastScanRef.current.code === rawText && now - lastScanRef.current.at < RESCAN_COOLDOWN_MS) return;
      lastScanRef.current = { code: rawText, at: now };

      const parsed = parseCouponQR(rawText);
      if (!parsed.ok) {
        setResult({ status: "invalid" });
        scheduleReset();
        return;
      }

      busyRef.current = true;
      setResult({ status: "processing", couponId: parsed.couponId, mealType: parsed.mealType });
      try {
        const outcome = await redeemCoupon(parsed.couponId, parsed.mealType);
        setResult(outcome);
      } catch (e) {
        console.error(e);
        setResult({ status: "error", couponId: parsed.couponId, mealType: parsed.mealType });
      } finally {
        busyRef.current = false;
        scheduleReset();
      }
    },
    [scheduleReset]
  );

  useEffect(() => {
    if (!cameraId) return undefined;
    const qr = new Html5Qrcode(SCANNER_ELEMENT_ID, { verbose: false });
    scannerElRef.current = qr;
    let cancelled = false;

    qr.start(
      cameraId,
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        videoConstraints: { deviceId: { exact: cameraId } }
      },
      (decodedText) => processCode(decodedText),
      () => {} 
    )
      .then(async () => {
        if (cancelled) return;

        let track = null;
        for (let attempt = 0; attempt < 10 && !cancelled; attempt++) {
          const videoEl = document.querySelector(`#${SCANNER_ELEMENT_ID} video`);
          track = videoEl?.srcObject?.getVideoTracks?.()[0];
          if (track) break;
          await new Promise((r) => setTimeout(r, 100));
        }
        if (!track) return;

        try {
          const capabilities = track.getCapabilities?.();
          if (capabilities?.zoom) {
            const { min = 1, max = 1 } = capabilities.zoom;
            const target = min <= 1 && max >= 1 ? 1 : min;
            await track.applyConstraints({ advanced: [{ zoom: target }] });
          }
        } catch (e) {
          console.warn("Zoom reset failed:", e);
        }
      })
      .catch(() => {
        if (!cancelled) setCameraError("Couldn't start the camera. Check permissions and try again.");
      });

    return () => {
      cancelled = true;
      if (qr.isScanning) {
        qr.stop().then(() => qr.clear()).catch(() => {});
      } else {
        try { qr.clear(); } catch {}
      }
    };
  }, [cameraId, processCode]);

  const switchCamera = () => {
    if (cameras.length < 2) return;
    const idx = cameras.findIndex((c) => c.id === cameraId);
    setCameraId(cameras[(idx + 1) % cameras.length].id);
  };

  const toggleTorch = async () => {
    const qr = scannerElRef.current;
    if (!qr) return;
    try {
      await qr.applyVideoConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((t) => !t);
    } catch {
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const code = manualCode.trim().toUpperCase();
    if (!code) { setManualError("Enter a coupon ID."); return; }
    setManualError("");
    setResult({ status: "processing", couponId: code, mealType: manualMeal });
    try {
      const outcome = await redeemCoupon(code, manualMeal);
      setResult(outcome);
      setManualCode("");
    } catch (e) {
      console.error(e);
      setResult({ status: "error", couponId: code, mealType: manualMeal });
    } finally {
      scheduleReset();
    }
  };

  const dismissResult = () => {
    window.clearTimeout(resultTimerRef.current);
    setResult(null);
  };

  const isProcessing = result?.status === "processing";
  const resultMeta = result && !isProcessing ? STATUS_META[result.status] : null;
  const mealMeta = result?.mealType ? MEAL_META[result.mealType] : null;

  return (
    <div className="smetec-redeem-shell">
      <style>{`
        html, body, #root { margin: 0; padding: 0; height: 100%; background: ${COLORS.pageBg}; }

        .smetec-redeem-shell {
          box-sizing: border-box;
          min-height: 100dvh;
          width: 100%;
          padding: clamp(0px, 2vw, 20px);
          background: ${COLORS.pageBg};
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
        }
        .smetec-redeem-card {
          background: ${COLORS.cardBg};
          border-radius: clamp(0px, 2vw, 20px);
          max-width: 560px;
          margin: 0 auto;
          box-shadow: ${CARD_SHADOW_LG};
          overflow: hidden;
          min-height: 100dvh;
        }
        @media (min-width: 641px) {
          .smetec-redeem-card { min-height: calc(100dvh - 40px); }
        }

        .smetec-redeem-header {
          background: ${GRADIENT};
          padding: clamp(18px, 5vw, 26px) clamp(18px, 5vw, 26px) clamp(22px, 6vw, 30px);
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        .smetec-redeem-header::after {
          content: "";
          position: absolute;
          right: -40px; top: -60px;
          width: 180px; height: 180px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
        }
        .smetec-redeem-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          opacity: 0.85;
        }
        .smetec-redeem-title {
          font-size: clamp(20px, 5vw, 25px);
          font-weight: 800;
          margin-top: 4px;
          letter-spacing: 0.2px;
        }

        .smetec-redeem-stats {
          display: flex;
          gap: 10px;
          margin-top: 16px;
          position: relative;
        }
        .smetec-redeem-stat {
          flex: 1;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 12px;
          padding: 9px 12px;
          backdrop-filter: blur(2px);
        }
        .smetec-redeem-stat-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          opacity: 0.85;
        }
        .smetec-redeem-stat-value {
          font-size: 22px;
          font-weight: 800;
          line-height: 1.2;
          margin-top: 1px;
        }

        .smetec-redeem-body {
          padding: clamp(18px, 5vw, 26px);
        }

        .smetec-scan-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 360px;
          margin: 0 auto;
          border-radius: 22px;
          overflow: hidden;
          background: #0D1117;
          box-shadow: ${PILL_SHADOW};
        }
        #${SCANNER_ELEMENT_ID} {
          width: 100% !important;
          height: 100% !important;
        }
        #${SCANNER_ELEMENT_ID} video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        .smetec-scan-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .smetec-scan-box {
          position: relative;
          width: 68%;
          height: 68%;
        }
        .smetec-scan-corner {
          position: absolute;
          width: 26px;
          height: 26px;
          border: 3px solid #ffffff;
        }
        .smetec-scan-corner.tl { top: 0; left: 0; border-right: none; border-bottom: none; border-top-left-radius: 8px; }
        .smetec-scan-corner.tr { top: 0; right: 0; border-left: none; border-bottom: none; border-top-right-radius: 8px; }
        .smetec-scan-corner.bl { bottom: 0; left: 0; border-right: none; border-top: none; border-bottom-left-radius: 8px; }
        .smetec-scan-corner.br { bottom: 0; right: 0; border-left: none; border-top: none; border-bottom-right-radius: 8px; }
        .smetec-scan-laser {
          position: absolute;
          left: 4%;
          right: 4%;
          height: 2px;
          background: linear-gradient(90deg, transparent, ${COLORS.now}, transparent);
          box-shadow: 0 0 8px 1px ${COLORS.now};
          animation: smetec-laser-sweep 2.2s ease-in-out infinite;
        }
        @keyframes smetec-laser-sweep {
          0%, 100% { top: 4%; opacity: 0.9; }
          50% { top: 94%; opacity: 0.5; }
        }

        .smetec-scan-hint {
          text-align: center;
          font-size: 12.5px;
          font-weight: 600;
          color: ${COLORS.subtle};
          margin-top: 14px;
        }

        .smetec-scan-tools {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 12px;
        }
        .smetec-scan-tool-btn {
          border: 1px solid #DCE6F0;
          background: #fff;
          border-radius: 20px;
          padding: 7px 14px;
          font-size: 12px;
          font-weight: 700;
          color: ${COLORS.ink};
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .smetec-scan-tool-btn:hover { border-color: ${COLORS.headerBlue}; color: ${COLORS.headerBlue}; }

        .smetec-camera-error {
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: #C0392B;
          background: #FDEDEC;
          border-radius: 10px;
          padding: 12px 16px;
          margin: 0 auto;
          max-width: 360px;
        }

        .smetec-manual-toggle {
          display: block;
          margin: 20px auto 0;
          background: none;
          border: none;
          font-size: 12.5px;
          font-weight: 700;
          color: ${COLORS.headerBlue};
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .smetec-manual-form {
          margin-top: 14px;
          background: #F7FAFD;
          border: 1.5px solid #DCE6F0;
          border-radius: 14px;
          padding: 14px 16px;
        }
        .smetec-manual-row { display: flex; gap: 8px; margin-bottom: 8px; }
        .smetec-manual-input {
          flex: 1 1 auto;
          box-sizing: border-box;
          border: 1.5px solid #DCE6F0;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          background: #fff;
        }
        .smetec-manual-input:focus { border-color: ${COLORS.headerBlue}; }
        .smetec-manual-select {
          border: 1.5px solid #DCE6F0;
          border-radius: 10px;
          padding: 9px 10px;
          font-size: 13px;
          font-family: inherit;
          background: #fff;
          color: ${COLORS.ink};
          font-weight: 600;
        }
        .smetec-manual-submit {
          width: 100%;
          border: none;
          border-radius: 10px;
          padding: 10px;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          background: ${GRADIENT};
          cursor: pointer;
        }
        .smetec-manual-error { font-size: 11.5px; color: #C0392B; font-weight: 600; margin-bottom: 8px; }

        .smetec-result-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(17, 24, 39, 0.42);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          z-index: 40;
          animation: smetec-fade-in 0.18s ease-out;
        }
        @media (min-width: 641px) {
          .smetec-result-backdrop { align-items: center; }
        }
        @keyframes smetec-fade-in { from { opacity: 0; } to { opacity: 1; } }

        .smetec-result-card {
          width: 100%;
          max-width: 460px;
          background: #fff;
          border-radius: 22px 22px 0 0;
          padding: 28px 26px 30px;
          box-sizing: border-box;
          text-align: center;
          animation: smetec-result-rise 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @media (min-width: 641px) {
          .smetec-result-card { border-radius: 22px; margin: 20px; }
        }
        @keyframes smetec-result-rise {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .smetec-result-ring {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          margin: 0 auto 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: smetec-ring-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes smetec-ring-pop {
          0% { transform: scale(0.4); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .smetec-result-title {
          font-size: 18px;
          font-weight: 800;
          color: ${COLORS.ink};
          margin-bottom: 6px;
        }
        .smetec-result-sub {
          font-size: 13px;
          color: ${COLORS.subtle};
          font-weight: 500;
          margin-bottom: 16px;
        }
        .smetec-result-mealpill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          border-radius: 20px;
          padding: 5px 14px;
          margin-bottom: 4px;
        }
        .smetec-result-coupon {
          font-family: 'Courier New', monospace;
          font-size: 13px;
          font-weight: 700;
          color: ${COLORS.ink};
          letter-spacing: 0.5px;
          margin-top: 10px;
        }
        .smetec-result-dismiss {
          margin-top: 20px;
          width: 100%;
          border: 1.5px solid #E1E5EA;
          background: #fff;
          border-radius: 12px;
          padding: 11px;
          font-size: 13px;
          font-weight: 700;
          color: ${COLORS.ink};
          cursor: pointer;
        }

        .smetec-spinner {
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 3.5px solid #E1E5EA;
          border-top-color: ${COLORS.headerBlue};
          animation: smetec-spin 0.7s linear infinite;
        }
        @keyframes smetec-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="smetec-redeem-card">
        <div className="smetec-redeem-header">
          <div className="smetec-redeem-eyebrow">SMETEC 2026 · Committee</div>
          <div className="smetec-redeem-title">Meal Redemption</div>

          <div className="smetec-redeem-stats">
            <div className="smetec-redeem-stat">
              <div className="smetec-redeem-stat-label">☀️ Breakfast</div>
              <div className="smetec-redeem-stat-value">{stats.breakfast}</div>
            </div>
            <div className="smetec-redeem-stat">
              <div className="smetec-redeem-stat-label">🍽️ Lunch</div>
              <div className="smetec-redeem-stat-value">{stats.lunch}</div>
            </div>
          </div>
        </div>

        <div className="smetec-redeem-body">
          {cameraError ? (
            <div className="smetec-camera-error">{cameraError}</div>
          ) : (
            <>
              <div className="smetec-scan-frame">
                <div id={SCANNER_ELEMENT_ID} />
                <div className="smetec-scan-overlay">
                  <div className="smetec-scan-box">
                    <div className="smetec-scan-corner tl" />
                    <div className="smetec-scan-corner tr" />
                    <div className="smetec-scan-corner bl" />
                    <div className="smetec-scan-corner br" />
                    <div className="smetec-scan-laser" />
                  </div>
                </div>
              </div>
              <div className="smetec-scan-hint">Point the camera at an attendee's breakfast or lunch QR code</div>
              <div className="smetec-scan-tools">
                {cameras.length > 1 && (
                  <button type="button" className="smetec-scan-tool-btn" onClick={switchCamera}>⟲ Switch camera</button>
                )}
                <button type="button" className="smetec-scan-tool-btn" onClick={toggleTorch}>
                  {torchOn ? "🔦 Torch on" : "🔦 Torch"}
                </button>
              </div>
            </>
          )}

          <button type="button" className="smetec-manual-toggle" onClick={() => setManualOpen((v) => !v)}>
            {manualOpen ? "Hide manual entry" : "Can't scan? Enter coupon ID manually"}
          </button>

          {manualOpen && (
            <form className="smetec-manual-form" onSubmit={handleManualSubmit}>
              {manualError && <div className="smetec-manual-error">{manualError}</div>}
              <div className="smetec-manual-row">
                <input
                  className="smetec-manual-input"
                  placeholder="Coupon ID"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  autoCapitalize="characters"
                />
                <select
                  className="smetec-manual-select"
                  value={manualMeal}
                  onChange={(e) => setManualMeal(e.target.value)}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                </select>
              </div>
              <button type="submit" className="smetec-manual-submit">Redeem</button>
            </form>
          )}
        </div>
      </div>

      {result && (
        <div className="smetec-result-backdrop" onClick={!isProcessing ? dismissResult : undefined}>
          <div className="smetec-result-card" onClick={(e) => e.stopPropagation()}>
            {isProcessing ? (
              <>
                <div className="smetec-result-ring" style={{ background: "#EEF3F8" }}>
                  <div className="smetec-spinner" />
                </div>
                <div className="smetec-result-title">Checking coupon…</div>
                <div className="smetec-result-sub">{result.couponId}</div>
              </>
            ) : (
              <>
                <div className="smetec-result-ring" style={{ background: resultMeta.bg }}>
                  <ResultIcon status={result.status} color={resultMeta.fg} />
                </div>
                <div className="smetec-result-title" style={{ color: resultMeta.fg }}>{resultMeta.title}</div>

                {mealMeta && (
                  <span className="smetec-result-mealpill" style={{ background: mealMeta.bg, color: mealMeta.fg }}>
                    {mealMeta.label}
                  </span>
                )}

                {result.status === "already" && result.redeemedAt && (
                  <div className="smetec-result-sub">Already redeemed at {formatTime(result.redeemedAt)}</div>
                )}
                {result.status === "invalid" && (
                  <div className="smetec-result-sub">This QR code doesn't match a SMETEC 2026 coupon</div>
                )}
                {result.status === "error" && (
                  <div className="smetec-result-sub">Check your connection and try scanning again</div>
                )}

                {result.couponId && <div className="smetec-result-coupon">{result.couponId}</div>}

                <button type="button" className="smetec-result-dismiss" onClick={dismissResult}>
                  Scan next
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultIcon({ status, color }) {
  if (status === "success") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="34" height="34">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (status === "already") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5l3.2 1.9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}