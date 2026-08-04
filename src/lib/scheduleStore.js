// This is the ONLY file that communicates with the database
// Admin and public pages use this layer, so changing the storage backend only requires updating this file

// Implementation: Firebase Firestore
// All event sessions are stored as an array inside one document
// onSnapshot provides real-time updates to all connected users
// When the schedule document changes, Firestore automatically pushes the latest data without requiring manual polling

import { doc, getDoc, onSnapshot, setDoc, runTransaction, serverTimestamp, collection } from "firebase/firestore";
import { db } from "./firebase";
import { buildSeedSessions } from "../scheduleData";

const scheduleDocRef = doc(db, "schedules", "smetec2026");
const noticeDocRef = doc(db, "notices", "smetec2026");
const redemptionsCollectionRef = collection(db, "redemptions");

// Calls onChange(sessions) immediately with the current data, then again whenever the schedule changes on any device
export function subscribe(onChange, onError) {
  return onSnapshot(
    scheduleDocRef,
    async (snap) => {
      if (snap.exists()) {
        onChange(snap.data().sessions);
      } else {
        const seed = buildSeedSessions();
        await setDoc(scheduleDocRef, { sessions: seed });
        // onSnapshot triggers again automatically once the write completes
      }
    },
    (error) => {
      console.error("Schedule sync error:", error);
      onError?.(error);
    }
  );
}

export async function saveSessions(sessions) {
  await setDoc(scheduleDocRef, { sessions });
}

export async function resetSessions() {
  const seed = buildSeedSessions();
  await setDoc(scheduleDocRef, { sessions: seed });
  return seed;
}

export async function syncSessionContent() {
  const seed = buildSeedSessions();
  const snap = await getDoc(scheduleDocRef);

  if (!snap.exists()) {
    await setDoc(scheduleDocRef, { sessions: seed });
    return seed;
  }

  const current = snap.data().sessions || [];
  const seedById = Object.fromEntries(seed.map((row) => [row.id, row]));

  const merged = current.map((row) => {
    const seedRow = seedById[row.id];
    if (!seedRow) return row;

    if (row.type === "merged") {
      const { status, ...seedContent } = seedRow;
      return { ...row, ...seedContent };
    }

    const tracks = { ...row.tracks };
    Object.keys(tracks).forEach((track) => {
      const seedCell = seedRow.tracks?.[track];
      if (!seedCell) return;
      const { status, ...seedCellContent } = seedCell;
      tracks[track] = { ...tracks[track], ...seedCellContent };
    });

    return { ...row, tracks };
  });

  await setDoc(scheduleDocRef, { sessions: merged });
  return merged;
}

// real-time updates for the organiser notice
export function subscribeNotice(onChange, onError) {
  return onSnapshot(
    noticeDocRef,
    (snap) => {
      onChange(snap.exists() ? snap.data().text || "" : "");
    },
    (error) => {
      console.error("Notice sync error:", error);
      onError?.(error);
    }
  );
}

export async function saveNotice(text) {
  await setDoc(noticeDocRef, { text });
}

const MEAL_TYPES = ["breakfast", "lunch"];

export function parseCouponQR(raw) {
  if (!raw || typeof raw !== "string") return { ok: false };
  const parts = raw.trim().split("|");
  if (parts.length !== 3) return { ok: false };
  const [prefix, couponIdRaw, mealRaw] = parts;
  if (prefix !== "SMETEC2026") return { ok: false };
  const couponId = couponIdRaw.trim().toUpperCase();
  const mealType = (mealRaw || "").trim().toLowerCase();
  if (!couponId || !MEAL_TYPES.includes(mealType)) return { ok: false };
  return { ok: true, couponId, mealType };
}

export async function redeemCoupon(couponId, mealType) {
  const ref = doc(redemptionsCollectionRef, couponId);
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists() ? snap.data() : {};
    const existing = data[mealType];

    if (existing?.redeemed) {
      return {
        status: "already",
        couponId,
        mealType,
        redeemedAt: existing.redeemedAt?.toDate ? existing.redeemedAt.toDate() : null,
      };
    }

    tx.set(ref, { [mealType]: { redeemed: true, redeemedAt: serverTimestamp() } }, { merge: true });
    return { status: "success", couponId, mealType };
  });
}

export function subscribeRedemptionStats(onChange, onError) {
  return onSnapshot(
    redemptionsCollectionRef,
    (snap) => {
      let breakfast = 0;
      let lunch = 0;
      snap.forEach((d) => {
        const data = d.data();
        if (data.breakfast?.redeemed) breakfast += 1;
        if (data.lunch?.redeemed) lunch += 1;
      });
      onChange({ breakfast, lunch, total: snap.size });
    },
    (error) => {
      console.error("Redemption stats sync error:", error);
      onError?.(error);
    }
  );
}