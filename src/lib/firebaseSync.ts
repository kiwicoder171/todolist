import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  where,
  Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { CircleState, Partner, PartnerScoreState } from "@/context/HouseholdContext";
import { DailyTask } from "@/context/DailyTasksContext";
import { Routine } from "@/context/RoutinesContext";
import { KanbanCard } from "@/context/KanbanContext";

/**
 * Sanitizes object keys, stripping any `undefined` values before sending to Firestore
 * to prevent Firestore SDK from rejecting writes.
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Partial<T> {
  const clean: any = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) {
      clean[key] = obj[key];
    }
  }
  return clean;
}

/**
 * Saves or updates a circle in Firestore
 */
export async function saveCircleToFirebase(circle: CircleState): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const circleRef = doc(db, "circles", circle.id);
  const clean = sanitizeForFirestore(circle);
  await setDoc(circleRef, clean, { merge: true });
}

/**
 * Finds a circle by its unique join code (e.g. CUP-XXXX)
 */
export async function findCircleByJoinCode(joinCode: string): Promise<CircleState | null> {
  if (!db || !isFirebaseConfigured()) return null;
  const q = query(collection(db, "circles"), where("joinCode", "==", joinCode.trim().toUpperCase()));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as CircleState;
}

/**
 * Listens for real-time changes to a circle document
 */
export function subscribeToCircle(
  circleId: string,
  onUpdate: (circle: CircleState) => void
): Unsubscribe {
  if (!db || !isFirebaseConfigured()) return () => {};
  const circleRef = doc(db, "circles", circleId);
  return onSnapshot(circleRef, (snap) => {
    if (snap.exists()) {
      onUpdate(snap.data() as CircleState);
    }
  });
}

/**
 * Real-time listener for Daily Tasks subcollection
 */
export function subscribeToDailyTasks(
  circleId: string,
  onUpdate: (tasks: DailyTask[]) => void
): Unsubscribe {
  if (!db || !isFirebaseConfigured()) return () => {};
  const colRef = collection(db, "circles", circleId, "daily_tasks");
  return onSnapshot(colRef, (snap) => {
    const tasks = snap.docs.map((d) => d.data() as DailyTask);
    onUpdate(tasks);
  });
}

export async function upsertDailyTaskToFirebase(
  circleId: string,
  task: DailyTask
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const taskRef = doc(db, "circles", circleId, "daily_tasks", task.id);
  const clean = sanitizeForFirestore(task);
  await setDoc(taskRef, clean, { merge: true });
}

export async function deleteDailyTaskFromFirebase(
  circleId: string,
  taskId: string
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const taskRef = doc(db, "circles", circleId, "daily_tasks", taskId);
  await deleteDoc(taskRef);
}

/**
 * Real-time listener for Daily Routines subcollection
 */
export function subscribeToRoutines(
  circleId: string,
  onUpdate: (routines: Routine[]) => void
): Unsubscribe {
  if (!db || !isFirebaseConfigured()) return () => {};
  const colRef = collection(db, "circles", circleId, "routines");
  return onSnapshot(colRef, (snap) => {
    const routines = snap.docs.map((d) => d.data() as Routine);
    onUpdate(routines);
  });
}

export async function upsertRoutineToFirebase(
  circleId: string,
  routine: Routine
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const routineRef = doc(db, "circles", circleId, "routines", routine.id);
  const clean = sanitizeForFirestore(routine);
  await setDoc(routineRef, clean, { merge: true });
}

export async function deleteRoutineFromFirebase(
  circleId: string,
  routineId: string
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const routineRef = doc(db, "circles", circleId, "routines", routineId);
  await deleteDoc(routineRef);
}

/**
 * Real-time listener for Kanban Cards subcollection
 */
export function subscribeToKanbanCards(
  circleId: string,
  onUpdate: (cards: KanbanCard[]) => void
): Unsubscribe {
  if (!db || !isFirebaseConfigured()) return () => {};
  const colRef = collection(db, "circles", circleId, "kanban_cards");
  return onSnapshot(colRef, (snap) => {
    const cards = snap.docs.map((d) => d.data() as KanbanCard);
    onUpdate(cards);
  });
}

export async function upsertKanbanCardToFirebase(
  circleId: string,
  card: KanbanCard
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const cardRef = doc(db, "circles", circleId, "kanban_cards", String(card.id));
  const clean = sanitizeForFirestore(card);
  await setDoc(cardRef, clean, { merge: true });
}

export async function deleteKanbanCardFromFirebase(
  circleId: string,
  cardId: string | number
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const cardRef = doc(db, "circles", circleId, "kanban_cards", String(cardId));
  await deleteDoc(cardRef);
}

/**
 * Updates household points and streaks
 */
export async function updateScoresInFirebase(
  circleId: string,
  scores: Record<Partner, PartnerScoreState>,
  appliedPenalties?: Record<Partner, Record<string, number>>,
  perfectDays?: Record<Partner, string[]>
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const circleRef = doc(db, "circles", circleId);
  const cleanScores = sanitizeForFirestore(scores);
  const payload: any = { scores: cleanScores };
  if (appliedPenalties) payload.appliedPenalties = sanitizeForFirestore(appliedPenalties);
  if (perfectDays) payload.perfectDays = sanitizeForFirestore(perfectDays);
  await setDoc(circleRef, payload, { merge: true });
}

/**
 * Real-time listener for circle notifications subcollection
 */
export function subscribeToNotifications(
  circleId: string,
  onUpdate: (notifications: any[]) => void
): Unsubscribe {
  if (!db || !isFirebaseConfigured()) return () => {};
  const colRef = collection(db, "circles", circleId, "notifications");
  return onSnapshot(colRef, (snap) => {
    const notifs = snap.docs.map((d) => d.data());
    onUpdate(notifs);
  });
}

export async function upsertNotificationToFirebase(
  circleId: string,
  notification: any
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const notifRef = doc(db, "circles", circleId, "notifications", notification.id);
  const clean = sanitizeForFirestore(notification);
  await setDoc(notifRef, clean, { merge: true });
}

export async function markNotificationReadInFirebase(
  circleId: string,
  notificationId: string,
  readBy: string[]
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const notifRef = doc(db, "circles", circleId, "notifications", notificationId);
  await updateDoc(notifRef, {
    read: true,
    readBy,
  });
}

export async function deleteNotificationFromFirebase(
  circleId: string,
  notificationId: string
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const notifRef = doc(db, "circles", circleId, "notifications", notificationId);
  await deleteDoc(notifRef);
}

export async function clearNotificationsFromFirebase(
  circleId: string
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const colRef = collection(db, "circles", circleId, "notifications");
  const snap = await getDocs(colRef);
  const deletePromises = snap.docs.map((d) => deleteDoc(d.ref));
  await Promise.all(deletePromises);
}

