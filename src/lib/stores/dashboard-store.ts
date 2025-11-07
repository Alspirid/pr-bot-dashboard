// Dashboard store for state management
import { EnrichedPR, type Severity } from "@/types";
import { create } from "zustand";

export type SeverityFilter = Severity | "all";
export type StateFilter = "all" | "open" | "closed" | "merged";

interface DashboardState {
  // Filters
  severityFilter: SeverityFilter;
  stateFilter: StateFilter;
  repositoryFilter: number | null; // Repository ID or null for all
  searchQuery: string;

  // Actions
  setSeverityFilter: (filter: SeverityFilter) => void;
  setStateFilter: (filter: StateFilter) => void;
  setRepositoryFilter: (repoId: number | null) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Initial state
  severityFilter: "all",
  stateFilter: "all",
  repositoryFilter: null,
  searchQuery: "",

  // Actions
  setSeverityFilter: (filter) => set({ severityFilter: filter }),
  setStateFilter: (filter) => set({ stateFilter: filter }),
  setRepositoryFilter: (repoId) => set({ repositoryFilter: repoId }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  clearFilters: () =>
    set({
      severityFilter: "all",
      stateFilter: "all",
      repositoryFilter: null,
      searchQuery: "",
    }),
}));

// Selector helper for filtering PRs (sorting is handled by PRTable component)
export function filterPRs(
  prs: EnrichedPR[],
  state: DashboardState
): EnrichedPR[] {
  let filtered = [...prs];

  // Apply severity filter
  if (state.severityFilter !== "all") {
    filtered = filtered.filter(
      (pr) => pr.risk_assessment.factors.max_severity === state.severityFilter
    );
  }

  // Apply state filter
  if (state.stateFilter !== "all") {
    if (state.stateFilter === "merged") {
      filtered = filtered.filter((pr) => pr.merged === true);
    } else {
      filtered = filtered.filter((pr) => pr.state === state.stateFilter);
    }
  }

  // Apply repository filter
  if (state.repositoryFilter !== null) {
    filtered = filtered.filter(
      (pr) => pr.repository.id === state.repositoryFilter
    );
  }

  // Apply search query
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (pr) =>
        pr.title.toLowerCase().includes(query) ||
        pr.id.toString().includes(query) ||
        pr.repository.name.toLowerCase().includes(query)
    );
  }

  return filtered;
}
