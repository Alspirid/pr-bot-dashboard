"use client";

import FilterPanel from "@/components/pr-list/FilterPanel";
import PRTable from "@/components/pr-list/PRTable";
import { NoPRsFound } from "@/components/shared/EmptyState";

import { getAllPRs } from "@/lib/data/pr-data";
import { filterPRs, useDashboardStore } from "@/lib/stores/dashboard-store";
import { Text } from "@tremor/react";
import { useMemo } from "react";

export default function PRsPage() {
  const pullRequests = getAllPRs();
  const dashboardState = useDashboardStore();
  const clearFilters = dashboardState.clearFilters;

  const filteredPRs = filterPRs(pullRequests, dashboardState);

  const stats = useMemo(
    () => ({
      open: filteredPRs.filter((pr) => pr.state === "open").length,
      highRisk: filteredPRs.filter((pr) => (pr.risk_score || 0) >= 70).length,
      criticalFindings: filteredPRs.reduce(
        (sum, pr) => sum + pr.risk_assessment.severity_breakdown.critical,
        0
      ),
    }),
    [filteredPRs]
  );

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pull Requests</h1>
        <p className="text-gray-600 mt-1">
          View and triage all security findings across pull requests
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        <div className="w-80 shrink-0">
          <FilterPanel />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Summary Stats */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <Text className="text-gray-600 text-sm">Total PRs</Text>
                  <Text className="text-2xl font-bold">
                    {pullRequests.length}
                  </Text>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm">Filtered</Text>
                  <Text className="text-2xl font-bold text-blue-600">
                    {filteredPRs.length}
                  </Text>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm">Open</Text>
                  <Text className="text-2xl font-bold text-green-600">
                    {stats.open}
                  </Text>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm">High Risk</Text>
                  <Text className="text-2xl font-bold text-red-600">
                    {stats.highRisk}
                  </Text>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm">
                    Critical Findings
                  </Text>
                  <Text className="text-2xl font-bold text-red-600">
                    {stats.criticalFindings}
                  </Text>
                </div>
              </div>
            </div>
          </div>
          {filteredPRs.length === 0 ? (
            <NoPRsFound onClearFilters={clearFilters} />
          ) : (
            <PRTable pullRequests={filteredPRs} />
          )}
        </div>
      </div>
    </div>
  );
}
