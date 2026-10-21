"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Assignee, useHousehold, matchesAssigneeFilter } from "./HouseholdContext";
import { useDailyTasks } from "./DailyTasksContext";
import { useOptionalAuth } from "./AuthContext";
import {
  subscribeToKanbanCards,
  upsertKanbanCardToFirebase,
  deleteKanbanCardFromFirebase,
} from "@/lib/firebaseSync";

export type KanbanStage = "todo" | "inprogress" | "done";

export interface KanbanCategoryItem {
  id: string;
  name: string;
  emoji?: string;
}

export interface KanbanCard {
  id: string;
  title: string;
  category: string;
  stage: KanbanStage;
  assignee: Assignee;
  doToday: boolean;
  description?: string;
}

export interface KanbanContextType {
  cards: KanbanCard[];
  categories: KanbanCategoryItem[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  addCard: (
    title: string,
    category: string,
    stage: KanbanStage,
    assignee: Assignee,
    description?: string
  ) => void;
  updateCard: (id: string, updates: Partial<KanbanCard>) => void;
  deleteCard: (id: string) => void;
  moveCardStage: (id: string, targetStage: KanbanStage) => void;
  toggleCardDoToday: (id: string) => void;
  addCategory: (id: string, name: string, emoji?: string) => void;
  clearDoneCards: () => void;
  getFilteredCardsByStage: (stage: KanbanStage) => KanbanCard[];
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const DEFAULT_CATEGORIES: KanbanCategoryItem[] = [
  { id: "all", name: "All" },
  { id: "home", name: "Home", emoji: "🏠" },
  { id: "travel", name: "Travel", emoji: "✈️" },
  { id: "groceries", name: "Groceries", emoji: "🛒" },
];

export const SEED_KANBAN_CARDS: KanbanCard[] = [
  {
    id: "card-201",
    title: "Research Hakone onsens & ryokan",
    category: "travel",
    stage: "todo",
    assignee: "partner",
    doToday: false,
    description: "Look for private onsen options with mountain view",
  },
  {
    id: "card-202",
    title: "Book flight tickets to Tokyo",
    category: "travel",
    stage: "inprogress",
    assignee: "both",
    doToday: true,
    description: "Direct flights preferred",
  },
  {
    id: "card-203",
    title: "Replace living room light dimmer",
    category: "home",
    stage: "todo",
    assignee: "mine",
    doToday: false,
    description: "Need Lutron Caseta smart dimmer switch",
  },
  {
    id: "card-204",
    title: "Restock almond milk & oat berries",
    category: "groceries",
    stage: "done",
    assignee: "both",
    doToday: false,
    description: "Organic barista edition from Whole Foods",
  },
  {
    id: "card-205",
    title: "Plan anniversary surprise dinner",
    category: "home",
    stage: "todo",
    assignee: "mine",
    doToday: false,
    description: "Reserve tasting menu 2 weeks ahead",
  },
];

export const isSeedKanbanCards = (cardList: KanbanCard[]) => {
  if (!Array.isArray(cardList) || cardList.length !== SEED_KANBAN_CARDS.length) return false;
  return cardList.every((c) => SEED_KANBAN_CARDS.some((sc) => sc.id === c.id));
};

export function KanbanProvider({ children }: { children: ReactNode }) {
  const { activePartner, assigneeFilter, selectedDate, circle } = useHousehold();
  const circleId = circle?.id;
  const authContext = useOptionalAuth();
  const user = authContext?.user;
  const authLoading = authContext?.loading ?? false;
  const {
    addDailyTask,
    removeTaskByKanbanId,
    setTaskCompletedByKanbanId,
    registerKanbanSyncHook,
  } = useDailyTasks();

  const isTest = typeof process !== "undefined" && process.env.NODE_ENV === "test";

  const [cards, setCards] = useState<KanbanCard[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("couple_task_hub_kanban_cards");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            if (user && isSeedKanbanCards(parsed)) return [];
            return parsed;
          }
        }
      } catch {}
    }
    return user ? [] : SEED_KANBAN_CARDS;
  });

  // Client-side hydration from localStorage (runs after mount, eliminating SSR hydration mismatch)
  useEffect(() => {
    if (isTest || typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("couple_task_hub_kanban_cards");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          if (user && isSeedKanbanCards(parsed)) {
            setCards([]);
            localStorage.removeItem("couple_task_hub_kanban_cards");
          } else if (parsed.length > 0 || user) {
            setCards(parsed);
          }
        }
      }
    } catch {}
  }, [isTest, user, circleId]);

  // Ensure mock kanban cards vanish when user logs in without circle, and reappear if unauthenticated
  useEffect(() => {
    if (authLoading) return;

    if (user && !circleId) {
      setCards((prev) => {
        if (isSeedKanbanCards(prev)) {
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("couple_task_hub_kanban_cards");
            } catch {}
          }
          return [];
        }
        return prev;
      });
    } else if (!user && !circleId) {
      setCards((prev) => {
        if (prev.length === 0) return SEED_KANBAN_CARDS;
        return prev;
      });
    }
  }, [user, circleId, authLoading]);

  // Real-time listener for kanban cards from Firebase
  useEffect(() => {
    if (!circleId) return;
    const unsub = subscribeToKanbanCards(circleId, (remoteCards) => {
      if (remoteCards) {
        setCards((prev) => {
          const remoteIds = new Set(remoteCards.map((c) => c.id));
          const localOnly = prev.filter(
            (c) => !remoteIds.has(c.id) && !SEED_KANBAN_CARDS.some((s) => s.id === c.id)
          );
          const merged = [...remoteCards, ...localOnly];
          try {
            localStorage.setItem("couple_task_hub_kanban_cards", JSON.stringify(merged));
          } catch {}
          return merged;
        });
      }
    });
    return () => unsub();
  }, [circleId]);

  // Reset kanban cards when user leaves circle
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleLeave = () => {
      setCards(user ? [] : SEED_KANBAN_CARDS);
    };
    window.addEventListener("couple_hub_circle_left", handleLeave);
    return () => window.removeEventListener("couple_hub_circle_left", handleLeave);
  }, [user]);

  const saveCards = (updater: (prev: KanbanCard[]) => KanbanCard[]) => {
    setCards((prev) => {
      const next = updater(prev);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("couple_task_hub_kanban_cards", JSON.stringify(next));
        } catch {}
      }
      return next;
    });
  };

  const [categories, setCategories] =
    useState<KanbanCategoryItem[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Two-way sync: listen to DailyTasks completion toggles and deletions
  useEffect(() => {
    const unregister = registerKanbanSyncHook((kanbanId, completed, action) => {
      let updatedCard: KanbanCard | undefined;
      saveCards((prev) =>
        prev.map((c) => {
          if (String(c.id) === String(kanbanId)) {
            if (action === "delete") {
              updatedCard = { ...c, doToday: false };
            } else {
              updatedCard = { ...c, stage: completed ? "done" : "inprogress" };
            }
            return updatedCard;
          }
          return c;
        })
      );
      if (updatedCard && circleId) {
        upsertKanbanCardToFirebase(circleId, updatedCard).catch((err) =>
          console.warn("Kanban sync warning:", err?.message || err)
        );
      }
    });
    return unregister;
  }, [registerKanbanSyncHook, circleId]);

  const addCard = (
    title: string,
    category: string,
    stage: KanbanStage,
    assignee: Assignee,
    description?: string
  ) => {
    const newCard: KanbanCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      category,
      stage,
      assignee,
      doToday: false,
      description,
    };
    saveCards((prev) => [...prev, newCard]);
    if (circleId) {
      upsertKanbanCardToFirebase(circleId, newCard).catch((err) =>
        console.warn("Kanban sync warning:", err?.message || err)
      );
    }
  };

  const updateCard = (id: string, updates: Partial<KanbanCard>) => {
    const current = cards.find((c) => c.id === id);
    if (current && circleId) {
      upsertKanbanCardToFirebase(circleId, { ...current, ...updates }).catch((err) =>
        console.warn("Kanban sync warning:", err?.message || err)
      );
    }
    saveCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCard = (id: string) => {
    saveCards((prev) => prev.filter((c) => c.id !== id));
    removeTaskByKanbanId(id);
    if (circleId) {
      deleteKanbanCardFromFirebase(circleId, id).catch((err) =>
        console.warn("Kanban sync warning:", err?.message || err)
      );
    }
  };

  const moveCardStage = (id: string, targetStage: KanbanStage) => {
    const current = cards.find((c) => c.id === id);
    if (current && circleId) {
      upsertKanbanCardToFirebase(circleId, { ...current, stage: targetStage }).catch((err) =>
        console.warn("Kanban sync warning:", err?.message || err)
      );
    }
    saveCards((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          if (c.doToday) {
            if (targetStage === "done") {
              setTaskCompletedByKanbanId(id, true);
            } else {
              setTaskCompletedByKanbanId(id, false);
            }
          }
          return { ...c, stage: targetStage };
        }
        return c;
      })
    );
  };

  const toggleCardDoToday = (id: string) => {
    let updatedCard: KanbanCard | undefined;
    saveCards((prev) =>
      prev.map((c) => {
        if (String(c.id) === String(id)) {
          const nextDoToday = !c.doToday;
          if (nextDoToday) {
            addDailyTask(
              c.title,
              c.assignee,
              selectedDate,
              c.description || "Scheduled from Kanban",
              true,
              c.id
            );
          } else {
            removeTaskByKanbanId(c.id);
          }
          updatedCard = { ...c, doToday: nextDoToday };
          return updatedCard;
        }
        return c;
      })
    );
    if (updatedCard && circleId) {
      upsertKanbanCardToFirebase(circleId, updatedCard).catch((err) =>
        console.warn("Kanban sync warning:", err?.message || err)
      );
    }
  };

  const addCategory = (id: string, name: string, emoji?: string) => {
    setCategories((prev) => [...prev, { id, name, emoji }]);
  };

  const clearDoneCards = () => {
    const doneCards = cards.filter((c) => c.stage === "done");
    doneCards.forEach((c) => {
      removeTaskByKanbanId(c.id);
      if (circleId) {
        deleteKanbanCardFromFirebase(circleId, c.id).catch((err) =>
          console.warn("Kanban delete sync warning:", err?.message || err)
        );
      }
    });
    saveCards((prev) => prev.filter((c) => c.stage !== "done"));
  };

  const getFilteredCardsByStage = (stage: KanbanStage): KanbanCard[] => {
    return cards.filter((c) => {
      if (c.stage !== stage) return false;
      if (selectedCategory !== "all" && c.category !== selectedCategory)
        return false;
      if (!matchesAssigneeFilter(c.assignee, activePartner, assigneeFilter))
        return false;
      return true;
    });
  };

  return (
    <KanbanContext.Provider
      value={{
        cards,
        categories,
        selectedCategory,
        setSelectedCategory,
        addCard,
        updateCard,
        deleteCard,
        moveCardStage,
        toggleCardDoToday,
        addCategory,
        clearDoneCards,
        getFilteredCardsByStage,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
}

export function useKanban(): KanbanContextType {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
}
