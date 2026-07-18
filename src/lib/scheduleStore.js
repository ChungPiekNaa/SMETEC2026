// This is the ONLY file that communicates with the database
// Admin and public pages use this layer, so changing the storage backend only requires updating this file

// Implementation: Firebase Firestore
// All event sessions are stored as an array inside one document
// onSnapshot provides real-time updates to all connected users
// When the schedule document changes, Firestore automatically pushes the latest data without requiring manual polling

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { buildSeedSessions } from "../scheduleData";

const scheduleDocRef = doc(db, "schedules", "smetec2026");

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
