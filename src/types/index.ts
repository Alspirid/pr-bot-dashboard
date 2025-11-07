export type Severity = "critical" | "high" | "medium" | "low" | "none";

type Side = "LEFT" | "RIGHT";

type AuthorAssociation =
  | "COLLABORATOR"
  | "CONTRIBUTOR"
  | "FIRST_TIMER"
  | "FIRST_TIME_CONTRIBUTOR"
  | "MANNEQUIN"
  | "MEMBER"
  | "NONE"
  | "OWNER";

type ReviewState =
  | "APPROVED"
  | "CHANGES_REQUESTED"
  | "COMMENTED"
  | "DISMISSED"
  | "PENDING";

export type BotFinding = {
  id: number;
  severity: Severity;
  finding_type: string;
  cve_id?: string;
};

export type User = {
  login: string;
  id: number;
  node_id?: string;
  avatar_url: string;
  gravatar_id?: string;
  url?: string;
  html_url?: string;
  followers_url?: string;
  following_url?: string;
  gists_url?: string;
  starred_url?: string;
  subscriptions_url?: string;
  organizations_url?: string;
  repos_url?: string;
  events_url?: string;
  received_events_url?: string;
  type: "User" | "Organization" | "Bot";
  site_admin: boolean;
};

export type Repository = {
  id: number;
  name: string;
  full_name: string; // "owner/repo"
  owner: User;
  private: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
};

export type PullRequest = {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  merged: boolean;
  created_at: string; // ISO 8601
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  user: User; // PR author
  html_url: string;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
    sha: string;
  };

  repository: Repository;
  comments: number;
  review_comments: number;
  commits: number;
  additions: number;
  deletions: number;
  changed_files: number;
  risk_score?: number;
  critical_findings_count?: number;
  high_findings_count?: number;
  bot_comment_ids?: number[];
};

export type ReviewComment = {
  url?: string;
  pull_request_review_id: number;
  id: number;
  node_id?: string;
  diff_hunk: string;
  path: string;
  position?: number;
  original_position?: number;
  commit_id: string;
  original_commit_id?: string;
  in_reply_to_id?: number;
  user: User;
  body: string;
  created_at: string;
  updated_at: string;
  html_url?: string;
  pull_request_url?: string;
  author_association: AuthorAssociation;
  _links?: {
    self: { href: string };
    html: { href: string };
    pull_request: { href: string };
  };
  start_line?: number;
  original_start_line?: number;
  start_side?: Side;
  line?: number;
  original_line?: number;
  side?: Side;
};

export type IssueComment = {
  id: number;
  user: User;
  body: string;
  created_at: string;
  updated_at: string;
  author_association: AuthorAssociation;
  html_url: string;
};

export type Review = {
  id: number;
  user: User;
  body: string | null;
  state: ReviewState;
  submitted_at: string | null;
  commit_id: string;
  author_association: AuthorAssociation;
};

export type EnrichedPR = {
  repository: Repository;
  bot_comments: (ReviewComment & BotFinding)[];
  developer_responses: (ReviewComment | IssueComment)[];
  reviews: Review[];
  risk_assessment: RiskAssessment;
} & PullRequest;

export type RiskAssessment = {
  overall_score: number; // 0-100
  severity_breakdown: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    none: number;
  };
  factors: {
    findings_count: number;
    max_severity: Severity;
    lines_changed: number;
    developer_response_rate: number; // % of bot comments with responses
    time_open: number; // days
  };
};

export type TimeSeriesDataPoint = {
  timestamp: string; // ISO date
  critical: number;
  high: number;
  medium: number;
  low: number;
};

export type DashboardMetrics = {
  total_prs: number;
  open_prs: number;
  critical_findings: number;
  high_findings: number;
  avg_risk_score: number;
  trend_7d: number; // % change from previous 7 days
  unresponded_bot_comments: number;
};

export type ResponseType =
  | "acknowledged"
  | "fixed"
  | "disputed"
  | "needs_clarification";

export type SeverityBreakdown = Record<Severity, number>;
