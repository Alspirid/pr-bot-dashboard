"use client";

import SeverityBadge from "@/components/shared/SeverityBadge";
import StatusBadge from "@/components/shared/StatusBadge";

import { repoOptions } from "@/lib/data/repo-data";
import {
  SeverityFilter,
  StateFilter,
  useDashboardStore,
} from "@/lib/stores/dashboard-store";
import { Card, Text } from "@tremor/react";
import { Filter, X } from "lucide-react";

export default function FilterPanel() {
  const {
    severityFilter,
    stateFilter,
    repositoryFilter,
    searchQuery,
    setSeverityFilter,
    setStateFilter,
    setRepositoryFilter,
    setSearchQuery,
    clearFilters,
  } = useDashboardStore();

  const severityOptions = [
    "critical",
    "high",
    "medium",
    "low",
    "none",
  ] as const;

  const stateOptions = ["open", "closed", "merged"] as const;

  const handleSeverityToggle = (severity: SeverityFilter) => {
    if (severity === "all") {
      setSeverityFilter("all");
    } else if (severityFilter === severity) {
      setSeverityFilter("all");
    } else {
      setSeverityFilter(severity);
    }
  };

  const handleStateToggle = (state: StateFilter) => {
    if (state === "all") {
      setStateFilter("all");
    } else if (stateFilter === state) {
      setStateFilter("all");
    } else {
      setStateFilter(state);
    }
  };

  const hasActiveFilters =
    severityFilter !== "all" ||
    stateFilter !== "all" ||
    repositoryFilter !== null ||
    searchQuery !== "";

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <Text className="font-semibold text-lg">Filters</Text>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <Text className="font-medium mb-2">Search</Text>
          <input
            type="text"
            placeholder="Search by PR title, number, or repo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Severity Filter */}
        <div>
          <Text className="font-medium mb-3">Severity</Text>
          <div className="space-y-2">
            <button
              onClick={() => handleSeverityToggle("all")}
              className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                severityFilter === "all"
                  ? "bg-blue-50 border-blue-300 text-blue-900"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Text className="font-medium">All Severities</Text>
            </button>
            {severityOptions.map((severity) => (
              <button
                key={severity}
                onClick={() => handleSeverityToggle(severity)}
                className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                  severityFilter === severity
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <SeverityBadge severity={severity} size="sm" />
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <Text className="font-medium mb-3">Status</Text>
          <div className="space-y-2">
            <button
              onClick={() => handleStateToggle("all")}
              className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                stateFilter === "all"
                  ? "bg-blue-50 border-blue-300 text-blue-900"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Text className="font-medium">All Statuses</Text>
            </button>
            {stateOptions.map((state) => (
              <button
                key={state}
                onClick={() => handleStateToggle(state)}
                className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                  stateFilter === state
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
              >
                <StatusBadge
                  status={state}
                  merged={state === "merged"}
                  size="sm"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Repository Filter */}
        <div>
          <Text className="font-medium mb-2">Repository</Text>
          <select
            value={repositoryFilter || ""}
            onChange={(e) =>
              setRepositoryFilter(
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
          >
            <option value="">All Repositories</option>
            {repoOptions.map((repo) => (
              <option key={repo.id} value={repo.id}>
                {repo.name}
              </option>
            ))}
          </select>
        </div>

        {/* Applied Filters Summary */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <Text className="font-medium mb-2 text-sm text-gray-600">
              Applied Filters
            </Text>
            <div className="flex flex-wrap gap-2">
              {severityFilter !== "all" && (
                <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                  <SeverityBadge
                    severity={severityFilter}
                    size="sm"
                    showIcon={false}
                  />
                  <button
                    onClick={() => setSeverityFilter("all")}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {stateFilter !== "all" && (
                <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
                  <StatusBadge
                    status={stateFilter as "open" | "closed" | "merged"}
                    merged={stateFilter === "merged"}
                    size="sm"
                  />
                  <button
                    onClick={() => setStateFilter("all")}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {repositoryFilter !== null && (
                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                  {repoOptions.find((r) => r.id === repositoryFilter)?.name}
                  <button
                    onClick={() => setRepositoryFilter(null)}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {searchQuery && (
                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">
                  &quot;{searchQuery}&quot;
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
