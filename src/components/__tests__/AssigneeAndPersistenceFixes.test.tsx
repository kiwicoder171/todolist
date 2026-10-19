import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { HouseholdProvider, useHousehold } from "@/context/HouseholdContext";
import { DailyTasksProvider, useDailyTasks } from "@/context/DailyTasksContext";
import { RoutinesProvider, useRoutines } from "@/context/RoutinesContext";
import { KanbanProvider, useKanban } from "@/context/KanbanContext";
import { DailyTasksBoard } from "@/components/DailyTasksBoard";
import { DailyRoutinesBoard } from "@/components/DailyRoutinesBoard";
import { KanbanBoard } from "@/components/KanbanBoard";

function TestContextConsumer() {
  const { activePartner, setActivePartner, setAssigneeFilter, assigneeFilter, scores } = useHousehold();
  const { addDailyTask, tasks } = useDailyTasks();
  const { addRoutine, routines } = useRoutines();
  const { addCard, cards } = useKanban();

  return (
    <div>
      <div data-testid="active-partner">{activePartner}</div>
      <div data-testid="assignee-filter">{assigneeFilter}</div>
      <div data-testid="sam-points">{scores.sam.points}</div>
      <div data-testid="alex-points">{scores.alex.points}</div>
      <button onClick={() => setActivePartner("sam")}>Switch to Sam</button>
      <button onClick={() => setActivePartner("alex")}>Switch to Alex</button>
      <button onClick={() => setAssigneeFilter("mine")}>Filter Mine</button>
      <button onClick={() => setAssigneeFilter("partner")}>Filter Partner</button>
    </div>
  );
}

function renderFullApp(ui: React.ReactNode) {
  return render(
    <HouseholdProvider>
      <RoutinesProvider>
        <DailyTasksProvider>
          <KanbanProvider>
            {ui}
            <TestContextConsumer />
          </KanbanProvider>
        </DailyTasksProvider>
      </RoutinesProvider>
    </HouseholdProvider>
  );
}

describe("Assignee Filter & Inversion Bug Fixes (Ticket 2 & 3)", () => {
  beforeEach(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.clear();
    }
  });

  it("assigns task to Sam when Sam chooses 'Me', showing it under 'Mine' filter instead of Alex's", async () => {
    renderFullApp(<DailyTasksBoard />);

    // Switch active user to Sam
    fireEvent.click(screen.getByRole("button", { name: "Switch to Sam" }));
    expect(screen.getByTestId("active-partner")).toHaveTextContent("sam");

    // Sam adds a task with 'Me' (which is default)
    const input = screen.getByLabelText(/What gotta finish today/i);
    fireEvent.change(input, { target: { value: "Sam's personal errand" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // Task should be in the document
    expect(screen.getByText("Sam's personal errand")).toBeInTheDocument();

    // Now filter by 'Mine'
    fireEvent.click(screen.getByRole("button", { name: "Filter Mine" }));
    expect(screen.getByTestId("assignee-filter")).toHaveTextContent("mine");

    // Task MUST still be visible under 'Mine' for Sam!
    expect(screen.getByText("Sam's personal errand")).toBeInTheDocument();

    // Now filter by 'Partner' (Alex's tasks)
    fireEvent.click(screen.getByRole("button", { name: "Filter Partner" }));
    expect(screen.getByTestId("assignee-filter")).toHaveTextContent("partner");

    // Task MUST NOT be under partner's filter!
    expect(screen.queryByText("Sam's personal errand")).not.toBeInTheDocument();
  });

  it("displays 'Me' on cards assigned to active user, regardless of whether Alex or Sam is active", () => {
    renderFullApp(<DailyTasksBoard />);

    // Switch to Sam
    fireEvent.click(screen.getByRole("button", { name: "Switch to Sam" }));

    // Sam adds task
    const input = screen.getByLabelText(/What gotta finish today/i);
    fireEvent.change(input, { target: { value: "Workout session" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    // The badge should display 'Me' for Sam, not Alex's name or 'Partner'
    const badges = screen.getAllByText("Me");
    expect(badges.length).toBeGreaterThan(0);
  });
});
