"use client";

import {
  avgResponseRatePercentage,
  avgTimeOpen,
  engagementData,
  repoChartData,
  repoStats,
  responseTimeData,
  riskDistribution,
  severityData,
  totalFindings,
} from "@/lib/data/analyticsData";
import { BarChart, Card, DonutChart, Grid, Text } from "@tremor/react";
import { AlertTriangle, Clock, TrendingUp, Users } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
        <p className="text-gray-600 mt-1">
          Deep dive into security metrics, trends, and repository performance
        </p>
      </div>

      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
        <Card decoration="top" decorationColor="blue">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <Text className="text-gray-600">Avg Response Rate</Text>
              <Text className="text-2xl font-bold">
                {avgResponseRatePercentage}%
              </Text>
            </div>
          </div>
        </Card>

        <Card decoration="top" decorationColor="orange">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-orange-600" />
            <div>
              <Text className="text-gray-600">Avg Time Open</Text>
              <Text className="text-2xl font-bold">
                {Math.round(avgTimeOpen)} days
              </Text>
            </div>
          </div>
        </Card>

        <Card decoration="top" decorationColor="red">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <Text className="text-gray-600">Total Findings</Text>
              <Text className="text-2xl font-bold">{totalFindings}</Text>
            </div>
          </div>
        </Card>

        <Card decoration="top" decorationColor="green">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <Text className="text-gray-600">Repositories</Text>
              <Text className="text-2xl font-bold">
                {Object.keys(repoStats).length}
              </Text>
            </div>
          </div>
        </Card>
      </Grid>

      {/* Repository Performance */}
      <Card>
        <Text className="text-lg font-semibold mb-4">
          Repository Performance Comparison
        </Text>
        <BarChart
          data={repoChartData}
          index="repository"
          categories={["Open PRs", "Critical Findings", "Avg Risk Score"]}
          colors={["green", "red", "orange"]}
          valueFormatter={(value) => value.toString()}
          yAxisWidth={48}
          className="h-80"
        />
      </Card>

      {/* Risk Distribution and Developer Engagement */}
      <Grid numItems={1} numItemsMd={2} className="gap-6">
        <Card>
          <Text className="text-lg font-semibold mb-4">
            Risk Score Distribution
          </Text>
          <DonutChart
            data={riskDistribution}
            category="count"
            index="range"
            valueFormatter={(value) => `${value} PRs`}
            colors={["blue", "yellow", "orange", "red"]}
            className="h-72"
          />
        </Card>

        <Card>
          <Text className="text-lg font-semibold mb-4">
            Developer Response Rate Distribution
          </Text>
          <DonutChart
            data={engagementData}
            category="count"
            index="category"
            valueFormatter={(value) => `${value} PRs`}
            colors={["green", "yellow", "red"]}
            className="h-72"
          />
        </Card>
      </Grid>

      {/* Response Time and Severity Analysis */}
      <Grid numItems={1} numItemsMd={2} className="gap-6">
        <Card>
          <Text className="text-lg font-semibold mb-4">
            Time to First Response
          </Text>
          <BarChart
            data={responseTimeData}
            index="timeframe"
            categories={["count"]}
            colors={["gray"]}
            valueFormatter={(value) => `${value} PRs`}
            yAxisWidth={54}
            className="h-72"
            showLegend={false}
          />
        </Card>

        <Card>
          <Text className="text-lg font-semibold mb-4">
            Total Findings by Severity
          </Text>
          <DonutChart
            data={severityData}
            category="count"
            index="severity"
            colors={["red", "orange", "yellow", "blue"]}
            className="h-72"
          />
        </Card>
      </Grid>
    </div>
  );
}
