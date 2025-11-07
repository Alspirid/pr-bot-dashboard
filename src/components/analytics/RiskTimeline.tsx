"use client";

import { Card, Text, AreaChart } from "@tremor/react";
import { TimeSeriesDataPoint } from "@/types";

interface RiskTimelineProps {
  data: TimeSeriesDataPoint[];
}

export default function RiskTimeline({ data }: RiskTimelineProps) {
  // Calculate total findings for each data point
  const enrichedData = data.map((point) => ({
    ...point,
    total: point.critical + point.high + point.medium + point.low,
  }));

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <Text className="font-medium text-lg">Security Events Timeline</Text>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-600">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-gray-600">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-600">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-600">Low</span>
          </div>
        </div>
      </div>
      <AreaChart
        data={enrichedData}
        index="timestamp"
        categories={["critical", "high", "medium", "low"]}
        colors={["red", "orange", "yellow", "blue"]}
        showLegend={false}
        showGridLines={false}
        curveType="monotone"
        className="h-80"
      />
    </Card>
  );
}
