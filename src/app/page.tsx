import OverviewMetrics from "@/components/analytics/OverviewMetrics";
import RiskTimeline from "@/components/analytics/RiskTimeline";
import SeverityDistribution from "@/components/analytics/SeverityDistribution";
import { severityData, timelineData } from "@/lib/data/analyticsData";
import { getDashboardMetrics } from "@/lib/data/dashboard-data";
import { Grid } from "@tremor/react";

export default function Home() {
  const metrics = getDashboardMetrics();

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Security Overview</h1>
        <p className="text-gray-600 mt-1">
          Monitor security findings and risk metrics across all repositories
        </p>
      </div>

      <OverviewMetrics metrics={metrics} />

      <Grid numItems={1} numItemsMd={2} className="gap-6">
        <RiskTimeline data={timelineData} />
        <SeverityDistribution data={severityData} />
      </Grid>
    </div>
  );
}
