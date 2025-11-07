import { TimeSeriesDataPoint } from "@/types";
import { format } from "date-fns";
import { sampleData } from "./sample-data";

function prepareSeverityData(): { severity: string; count: number }[] {
  const totals = sampleData.pullRequests.reduce(
    (acc, pr) => {
      acc.critical += pr.risk_assessment.severity_breakdown.critical;
      acc.high += pr.risk_assessment.severity_breakdown.high;
      acc.medium += pr.risk_assessment.severity_breakdown.medium;
      acc.low += pr.risk_assessment.severity_breakdown.low;
      return acc;
    },
    { critical: 0, high: 0, medium: 0, low: 0 }
  );

  return [
    { severity: "Critical", count: totals.critical },
    { severity: "High", count: totals.high },
    { severity: "Medium", count: totals.medium },
    { severity: "Low", count: totals.low },
  ];
}

function prepareTimelineData(): TimeSeriesDataPoint[] {
  // Group PRs by date and aggregate severity counts
  const dateMap = new Map<string, TimeSeriesDataPoint>();

  sampleData.pullRequests.forEach((pr) => {
    const date = format(new Date(pr.created_at), "yyyy-MM-dd");

    if (!dateMap.has(date)) {
      dateMap.set(date, {
        timestamp: date,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      });
    }

    const point = dateMap.get(date)!;
    point.critical += pr.risk_assessment.severity_breakdown.critical;
    point.high += pr.risk_assessment.severity_breakdown.high;
    point.medium += pr.risk_assessment.severity_breakdown.medium;
    point.low += pr.risk_assessment.severity_breakdown.low;
  });

  return Array.from(dateMap.values())
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
    .map((point) => ({
      ...point,
      timestamp: format(new Date(point.timestamp), "MMM dd"),
    }));
}

export const severityData = prepareSeverityData();
export const timelineData = prepareTimelineData();

const avgResponseRate =
  sampleData.pullRequests.reduce(
    (sum, pr) => sum + pr.risk_assessment.factors.developer_response_rate,
    0
  ) / sampleData.pullRequests.length;

export const avgResponseRatePercentage = Math.round(avgResponseRate * 100);

export const avgTimeOpen =
  sampleData.pullRequests.reduce(
    (sum, pr) => sum + pr.risk_assessment.factors.time_open,
    0
  ) / sampleData.pullRequests.length;

export const totalFindings = severityData.reduce(
  (a, { count }) => a + count,
  0
);

type RepoStatistics = Record<
  string,
  {
    name: string;
    totalPRs: number;
    openPRs: number;
    criticalFindings: number;
    avgRiskScore: number;
    totalRiskScore: number;
  }
>;

export const repoStats = sampleData.pullRequests.reduce((acc, pr) => {
  const repoName = pr.repository.full_name;
  if (!acc[repoName]) {
    acc[repoName] = {
      name: repoName,
      totalPRs: 0,
      openPRs: 0,
      criticalFindings: 0,
      avgRiskScore: 0,
      totalRiskScore: 0,
    };
  }
  acc[repoName].totalPRs++;
  if (pr.state === "open") acc[repoName].openPRs++;
  acc[repoName].criticalFindings +=
    pr.risk_assessment.severity_breakdown.critical;
  acc[repoName].totalRiskScore += pr.risk_score || 0;
  return acc;
}, {} as RepoStatistics);

export const repoChartData = Object.values(repoStats).map(
  (repo: RepoStatistics[string]) => ({
    repository: repo.name.split("/")[1],
    "Open PRs": repo.openPRs,
    "Critical Findings": repo.criticalFindings,
    "Avg Risk Score": Math.round(repo.totalRiskScore / repo.totalPRs),
  })
);

export const riskDistribution = [
  {
    range: "0-20 (Low)",
    count: sampleData.pullRequests.filter((pr) => (pr.risk_score || 0) < 20)
      .length,
  },
  {
    range: "20-40 (Medium)",
    count: sampleData.pullRequests.filter(
      (pr) => (pr.risk_score || 0) >= 20 && (pr.risk_score || 0) < 40
    ).length,
  },
  {
    range: "40-70 (High)",
    count: sampleData.pullRequests.filter(
      (pr) => (pr.risk_score || 0) >= 40 && (pr.risk_score || 0) < 70
    ).length,
  },
  {
    range: "70-100 (Critical)",
    count: sampleData.pullRequests.filter((pr) => (pr.risk_score || 0) >= 70)
      .length,
  },
];

// Developer Response Analytics
const developerEngagement = sampleData.pullRequests.reduce(
  (acc, pr) => {
    const responseRate = pr.risk_assessment.factors.developer_response_rate;
    if (responseRate >= 0.8) {
      acc.high++;
    } else if (responseRate >= 0.5) {
      acc.medium++;
    } else {
      acc.low++;
    }
    return acc;
  },
  { high: 0, medium: 0, low: 0 }
);

export const engagementData = [
  { category: "High (≥80%)", count: developerEngagement.high },
  { category: "Medium (50-79%)", count: developerEngagement.medium },
  { category: "Low (<50%)", count: developerEngagement.low },
];

// Time to First Response Analytics
const timeToResponseBuckets = sampleData.pullRequests.reduce(
  (acc, pr) => {
    const timeOpen = pr.risk_assessment.factors.time_open;
    if (timeOpen <= 1) {
      acc.sameDay++;
    } else if (timeOpen <= 3) {
      acc.within3Days++;
    } else if (timeOpen <= 7) {
      acc.within1Week++;
    } else {
      acc.over1Week++;
    }
    return acc;
  },
  { sameDay: 0, within3Days: 0, within1Week: 0, over1Week: 0 }
);

export const responseTimeData = [
  { timeframe: "Same Day", count: timeToResponseBuckets.sameDay },
  { timeframe: "1-3 Days", count: timeToResponseBuckets.within3Days },
  { timeframe: "4-7 Days", count: timeToResponseBuckets.within1Week },
  { timeframe: "Over 1 Week", count: timeToResponseBuckets.over1Week },
];
