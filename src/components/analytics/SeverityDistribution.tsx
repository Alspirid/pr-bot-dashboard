"use client";

import { Card, DonutChart, Text } from "@tremor/react";

interface SeverityData {
  severity: string;
  count: number;
}

interface SeverityDistributionProps {
  data: SeverityData[];
}

export default function SeverityDistribution({
  data,
}: SeverityDistributionProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "text-red-600";
      case "high":
        return "text-orange-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-100";
      case "high":
        return "bg-orange-100";
      case "medium":
        return "bg-yellow-100";
      case "low":
        return "bg-blue-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <Card>
      <Text className="font-medium text-lg mb-4">Findings by Severity</Text>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <DonutChart
            data={data}
            variant="pie"
            category="count"
            index="severity"
            colors={["red", "orange", "yellow", "blue"]}
            className="h-64"
          />
        </div>
        <div className="flex-1">
          <div className="space-y-3">
            {data.map((item) => {
              const percentage =
                total > 0 ? ((item.count / total) * 100).toFixed(1) : "0";
              return (
                <div
                  key={item.severity}
                  className={`p-3 rounded-lg ${getSeverityBgColor(
                    item.severity
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Text
                        className={`font-semibold ${getSeverityColor(
                          item.severity
                        )}`}
                      >
                        {item.severity}
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        {item.count} findings
                      </Text>
                    </div>
                    <div
                      className={`text-2xl font-bold ${getSeverityColor(
                        item.severity
                      )}`}
                    >
                      {percentage}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <Text className="text-gray-600 text-sm">Total Findings</Text>
            <Text className="text-2xl font-bold text-gray-900">{total}</Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
