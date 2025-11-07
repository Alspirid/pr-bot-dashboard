"use client";

import SeverityBadge from "@/components/shared/SeverityBadge";
import StatusBadge from "@/components/shared/StatusBadge";
import { getPRById } from "@/lib/data/pr-data";
import { getRiskScoreColor } from "@/lib/utils/risk-colors";
import {
  Badge,
  Card,
  Grid,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Text,
} from "@tremor/react";
import { format } from "date-fns";
import {
  Activity,
  AlertCircle,
  Calendar,
  ExternalLink,
  FileCode,
  GitBranch,
  MessageSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function PRDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const pr = getPRById(id);

  if (!pr) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <Text className="text-red-600 font-semibold mb-2">
              PR Not Found
            </Text>
            <Text className="text-gray-600 mb-4">
              The requested pull request could not be found
            </Text>
            <Link
              href="/prs"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to PR List
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Combine all events for timeline
  const timelineEvents = [
    ...pr.bot_comments.map((comment) => ({
      type: "bot_comment" as const,
      ...comment,
    })),
    ...pr.developer_responses.map((response) => ({
      type: "dev_response" as const,
      ...response,
    })),
    ...pr.reviews.map((review) => ({
      type: "review" as const,
      ...review,
      created_at: review.submitted_at || pr.created_at,
    })),
  ].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
          <Link href="/" className="hover:text-blue-600">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/prs" className="hover:text-blue-600">
            Pull Requests
          </Link>
          <span>/</span>
          <span className="text-gray-900">#{pr.id}</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{pr.title}</h1>
                <StatusBadge status={pr.state} merged={pr.merged} />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-mono">#{pr.id}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {pr.user.login}
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Opened {format(new Date(pr.created_at), "MMM dd, yyyy")}
                </div>
              </div>
            </div>
            <a
              href={pr.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <Badge color="gray" size="sm">
              <div className="flex items-center gap-1">
                <GitBranch className="w-4 h-4 mr-1" />
                {pr.repository.name}
              </div>
            </Badge>
            <Badge color="gray" size="sm">
              <div className="flex items-center gap-1">
                {`${pr.head.ref} → ${pr.base.ref}`}
              </div>
            </Badge>
            <Badge color="gray" size="sm">
              <div className="flex items-center gap-1">
                <FileCode className="w-4 h-4 mr-1" />
                {`${pr.changed_files} files • +${pr.additions} -${pr.deletions}`}
              </div>
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <TabGroup>
          <TabList className="mt-4">
            <Tab>
              <div className="flex items-center gap-1 font-bold">
                <Activity className="w-4 h-4" />
                <span>Overview</span>
              </div>
            </Tab>
            <Tab>
              <div className="flex items-center gap-1 font-bold">
                <MessageSquare className="w-4 h-4" />
                Comments (
                {pr.bot_comments.length + pr.developer_responses.length})
              </div>
            </Tab>
            <Tab>
              <div className="flex items-center gap-1 font-bold">
                <Calendar className="w-4 h-4" />
                Timeline ({timelineEvents.length})
              </div>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Overview Tab */}
            <TabPanel>
              <div className="space-y-6">
                {/* Risk Assessment */}
                <Grid
                  numItems={1}
                  numItemsSm={2}
                  numItemsLg={4}
                  className="gap-6"
                >
                  <Card
                    decoration="top"
                    decorationColor={
                      pr.risk_score && pr.risk_score >= 70
                        ? "red"
                        : pr.risk_score && pr.risk_score >= 40
                        ? "orange"
                        : "green"
                    }
                  >
                    <Text>Risk Score</Text>
                    <div
                      className={`text-4xl font-bold ${getRiskScoreColor(
                        pr.risk_score || 0
                      )}`}
                    >
                      {pr.risk_score || 0}
                    </div>
                    <Text className="text-gray-600 mt-1">Out of 100</Text>
                  </Card>

                  <Card>
                    <Text>Max Severity</Text>
                    <div className="mt-2">
                      <SeverityBadge
                        severity={pr.risk_assessment.factors.max_severity}
                        size="lg"
                      />
                    </div>
                    <Text className="text-gray-600 mt-2">
                      {pr.risk_assessment.factors.findings_count} total findings
                    </Text>
                  </Card>

                  <Card>
                    <Text>Severity Breakdown</Text>
                    <div className="space-y-2 mt-2">
                      {pr.risk_assessment.severity_breakdown.critical > 0 && (
                        <div className="flex items-center justify-between">
                          <SeverityBadge
                            severity="critical"
                            size="sm"
                            showIcon={false}
                          />
                          <span className="font-semibold">
                            {pr.risk_assessment.severity_breakdown.critical}
                          </span>
                        </div>
                      )}
                      {pr.risk_assessment.severity_breakdown.high > 0 && (
                        <div className="flex items-center justify-between">
                          <SeverityBadge
                            severity="high"
                            size="sm"
                            showIcon={false}
                          />
                          <span className="font-semibold">
                            {pr.risk_assessment.severity_breakdown.high}
                          </span>
                        </div>
                      )}
                      {pr.risk_assessment.severity_breakdown.medium > 0 && (
                        <div className="flex items-center justify-between">
                          <SeverityBadge
                            severity="medium"
                            size="sm"
                            showIcon={false}
                          />
                          <span className="font-semibold">
                            {pr.risk_assessment.severity_breakdown.medium}
                          </span>
                        </div>
                      )}
                      {pr.risk_assessment.severity_breakdown.low > 0 && (
                        <div className="flex items-center justify-between">
                          <SeverityBadge
                            severity="low"
                            size="sm"
                            showIcon={false}
                          />
                          <span className="font-semibold">
                            {pr.risk_assessment.severity_breakdown.low}
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card>
                    <Text>Response Rate</Text>
                    <div className="text-4xl font-bold text-gray-900 mt-2">
                      {Math.round(
                        pr.risk_assessment.factors.developer_response_rate * 100
                      )}
                      %
                    </div>
                    <Text className="text-gray-600 mt-1">
                      {pr.developer_responses.length} of{" "}
                      {pr.bot_comments.length} responded
                    </Text>
                  </Card>
                </Grid>
              </div>
            </TabPanel>

            {/* Comments Tab */}
            <TabPanel>
              <div className="space-y-6">
                {/* Bot Comments */}
                <Card>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Security Findings
                    </h2>
                    <Text className="text-gray-600">
                      {pr.bot_comments.length} findings from security bot
                    </Text>
                  </div>

                  <div className="space-y-4">
                    {pr.bot_comments.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No security findings for this PR
                      </div>
                    ) : (
                      pr.bot_comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <SeverityBadge
                                severity={comment.severity || "low"}
                              />
                              {comment.cve_id && (
                                <Badge color="red" size="sm">
                                  {comment.cve_id}
                                </Badge>
                              )}
                              {comment.finding_type && (
                                <Badge color="gray" size="sm">
                                  {comment.finding_type}
                                </Badge>
                              )}
                            </div>
                            <Text className="text-sm text-gray-500">
                              {format(
                                new Date(comment.created_at),
                                "MMM dd, yyyy HH:mm"
                              )}
                            </Text>
                          </div>

                          <div className="mb-3">
                            <Text className="text-sm text-gray-600 font-mono mb-1">
                              {`${comment.path}:${comment.line}`}
                            </Text>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                              <code>{comment.diff_hunk}</code>
                            </pre>
                          </div>

                          <div className="prose prose-sm max-w-none">
                            <Text className="text-gray-700 whitespace-pre-wrap">
                              {comment.body}
                            </Text>
                          </div>

                          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span className="font-medium">
                              {comment.user.login}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>

                {/* Developer Responses */}
                {pr.developer_responses.length > 0 && (
                  <Card>
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        Developer Responses
                      </h2>
                      <Text className="text-gray-600">
                        {pr.developer_responses.length} responses from
                        developers
                      </Text>
                    </div>

                    <div className="space-y-4">
                      {pr.developer_responses.map((response) => (
                        <div
                          key={response.id}
                          className="border border-blue-200 rounded-lg p-4 bg-blue-50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-600" />
                              <span className="font-medium text-gray-900">
                                {response.user.login}
                              </span>
                            </div>
                            <Text className="text-sm text-gray-500">
                              {format(
                                new Date(response.created_at),
                                "MMM dd, yyyy HH:mm"
                              )}
                            </Text>
                          </div>
                          <Text className="text-gray-700">{response.body}</Text>
                          {"in_reply_to_id" in response &&
                            response.in_reply_to_id && (
                              <Text className="text-xs text-gray-500 mt-2">
                                In reply to comment #{response.in_reply_to_id}
                              </Text>
                            )}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </TabPanel>

            {/* Timeline Tab */}
            <TabPanel>
              <Card>
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    Activity Timeline
                  </h2>
                  <Text className="text-gray-600">
                    Chronological view of all PR activity
                  </Text>
                </div>

                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-6">
                    {timelineEvents.map((event) => {
                      return (
                        <div key={event.id} className="relative pl-16">
                          <div
                            className={`absolute left-6 w-4 h-4 rounded-full ${
                              event.type === "bot_comment"
                                ? "bg-red-500"
                                : event.type === "dev_response"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            } border-4 border-white`}
                          />

                          <div
                            className={`${
                              event.type === "bot_comment"
                                ? "bg-red-50 border-red-200"
                                : event.type === "dev_response"
                                ? "bg-blue-50 border-blue-200"
                                : "bg-green-50 border-green-200"
                            } border rounded-lg p-4`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {event.type === "bot_comment" && (
                                  <>
                                    <Badge size="sm" color="red">
                                      Security Bot
                                    </Badge>
                                    {event.severity && (
                                      <SeverityBadge
                                        severity={event.severity}
                                        size="sm"
                                      />
                                    )}
                                  </>
                                )}
                                {event.type === "dev_response" && (
                                  <>
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">
                                      {event.user.login}
                                    </span>
                                    <Badge size="sm" color="blue">
                                      Response
                                    </Badge>
                                  </>
                                )}
                                {event.type === "review" && (
                                  <>
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">
                                      {event.user.login}
                                    </span>
                                    <Badge
                                      size="sm"
                                      color={
                                        event.state === "APPROVED"
                                          ? "green"
                                          : event.state === "CHANGES_REQUESTED"
                                          ? "orange"
                                          : "gray"
                                      }
                                    >
                                      {event.state}
                                    </Badge>
                                  </>
                                )}
                              </div>
                              <Text className="text-sm text-gray-500">
                                {format(
                                  new Date(event.created_at),
                                  "MMM dd, yyyy HH:mm"
                                )}
                              </Text>
                            </div>

                            <div className="text-sm text-gray-700">
                              {event.type === "bot_comment" && event.path && (
                                <div className="mb-2">
                                  <Text className="font-mono text-xs text-gray-600">
                                    {`${event.path}:${event.line}`}
                                  </Text>
                                </div>
                              )}
                              <Text className="whitespace-pre-wrap">
                                {event.body || "No content"}
                              </Text>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
