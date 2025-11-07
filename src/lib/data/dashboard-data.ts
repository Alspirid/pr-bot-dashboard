import { subDays } from "date-fns";
import { DashboardMetrics } from "../../types";
import { sampleData } from "./sample-data";

export function getDashboardMetrics(): DashboardMetrics {
  const prs = sampleData.pullRequests;
  const openPRs = prs.filter((pr) => pr.state === "open");

  const totalCritical = prs.reduce(
    (sum, pr) => sum + pr.risk_assessment.severity_breakdown.critical,
    0
  );
  const totalHigh = prs.reduce(
    (sum, pr) => sum + pr.risk_assessment.severity_breakdown.high,
    0
  );

  const avgRiskScore =
    prs.length > 0
      ? Math.round(
          prs.reduce((sum, pr) => sum + (pr.risk_score || 0), 0) / prs.length
        )
      : 0;

  // Calculate unresponded bot comments
  const unresponded = prs.reduce((sum, pr) => {
    const botComments = pr.bot_comments.length;
    const responses = pr.developer_responses.length;
    return sum + Math.max(0, botComments - responses);
  }, 0);

  // Calculate 7-day trend (simplified for fake data)
  const sevenDaysAgo = subDays(new Date(), 7);
  const recentPRs = prs.filter((pr) => new Date(pr.created_at) >= sevenDaysAgo);
  const olderPRs = prs.filter((pr) => new Date(pr.created_at) < sevenDaysAgo);

  const recentAvg =
    recentPRs.length > 0
      ? recentPRs.reduce((sum, pr) => sum + (pr.risk_score || 0), 0) /
        recentPRs.length
      : 0;
  const olderAvg =
    olderPRs.length > 0
      ? olderPRs.reduce((sum, pr) => sum + (pr.risk_score || 0), 0) /
        olderPRs.length
      : 0;

  const trend_7d = olderAvg > 0 ? ((recentAvg - olderAvg) / olderAvg) * 100 : 0;

  return {
    total_prs: prs.length,
    open_prs: openPRs.length,
    critical_findings: totalCritical,
    high_findings: totalHigh,
    avg_risk_score: avgRiskScore,
    trend_7d: Math.round(trend_7d * 10) / 10,
    unresponded_bot_comments: unresponded,
  };
}
