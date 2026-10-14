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
 * Saves or updates a circle in Firestore
 */
export async function saveCircleToFirebase(circle: CircleState): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const circleRef = doc(db, "circles", circle.id);
  await setDoc(circleRef, circle, { merge: true });
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
  await setDoc(taskRef, task, { merge: true });
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
  await setDoc(routineRef, routine, { merge: true });
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
  await setDoc(cardRef, card, { merge: true });
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
  scores: Record<Partner, PartnerScoreState>
): Promise<void> {
  if (!db || !isFirebaseConfigured()) return;
  const circleRef = doc(db, "circles", circleId);
  await updateDoc(circleRef, { scores });
}
