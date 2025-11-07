"use client";

import { Card, Grid, Metric, Text } from "@tremor/react";
import { DashboardMetrics } from "@/types";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface OverviewMetricsProps {
  metrics: DashboardMetrics;
}

export default function OverviewMetrics({ metrics }: OverviewMetricsProps) {
  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-red-600";
    if (trend < 0) return "text-green-600";
    return "text-gray-500";
  };

  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
      <Card decoration="top" decorationColor="blue">
        <Text>Total Pull Requests</Text>
        <Metric>{metrics.total_prs}</Metric>
        <div className="flex items-center gap-2 mt-2">
          {getTrendIcon(metrics.trend_7d)}
          <Text className={getTrendColor(metrics.trend_7d)}>
            {Math.abs(metrics.trend_7d)}% vs last 7 days
          </Text>
        </div>
      </Card>

      <Card decoration="top" decorationColor="red">
        <Text>Critical Findings</Text>
        <Metric className="text-red-600">{metrics.critical_findings}</Metric>
        <Text className="mt-2 text-gray-600">
          {metrics.high_findings} high severity
        </Text>
      </Card>

      <Card decoration="top" decorationColor="orange">
        <Text>Average Risk Score</Text>
        <Metric
          className={
            metrics.avg_risk_score >= 70
              ? "text-red-600"
              : metrics.avg_risk_score >= 40
              ? "text-orange-600"
              : "text-green-600"
          }
        >
          {metrics.avg_risk_score}
        </Metric>
        <Text className="mt-2 text-gray-600">Out of 100</Text>
      </Card>

      <Card decoration="top" decorationColor="green">
        <Text>Open PRs</Text>
        <Metric>{metrics.open_prs}</Metric>
        <Text className="mt-2 text-gray-600">
          {metrics.unresponded_bot_comments} unresponded findings
        </Text>
      </Card>
    </Grid>
  );
}
