import {
  BotFinding,
  EnrichedPR,
  PullRequest,
  Repository,
  ResponseType,
  Review,
  ReviewComment,
  RiskAssessment,
  SeverityBreakdown,
  User,
} from "@/types";

import { faker } from "@faker-js/faker";

faker.seed(123);

// ========== USER GENERATION ==========
function generateUser(isBot: boolean = false): User {
  return {
    id: faker.number.int({ min: 1000, max: 999999 }),
    login: isBot
      ? `security-bot-${faker.number.int({ min: 1, max: 10 })}`
      : faker.internet.username(),
    avatar_url: faker.image.avatar(),
    type: isBot ? "Bot" : "User",
    site_admin: false,
  };
}

const BOT_USERS: User[] = Array.from({ length: 3 }, () => generateUser(true));
const DEVELOPER_USERS: User[] = Array.from({ length: 15 }, () =>
  generateUser(false)
);

// ========== REPOSITORY GENERATION ==========
function generateRepository(): Repository {
  const owner = faker.helpers.arrayElement(DEVELOPER_USERS);
  const name = faker.helpers.slugify(
    `${faker.hacker.adjective()}-${faker.hacker.noun()}`
  );

  return {
    id: faker.number.int({ min: 10000, max: 999999 }),
    name,
    full_name: `${owner.login}/${name}`,
    owner,
    private: faker.datatype.boolean(),
    html_url: `https://github.com/${owner.login}/${name}`,
    description: faker.company.catchPhrase(),
    language: faker.helpers.arrayElement([
      "TypeScript",
      "JavaScript",
      "Python",
      "Go",
      "Rust",
      "Java",
    ]),
  };
}

const REPOSITORIES: Repository[] = Array.from(
  { length: 8 },
  generateRepository
);

// Counter for unique PR IDs
let nextPRId = 1;

function generatePullRequest(repository: Repository): PullRequest {
  const author = faker.helpers.arrayElement(DEVELOPER_USERS);
  const createdAt = faker.date.recent({ days: 90 });
  const isOpen = faker.datatype.boolean(0.6); // 60% open
  const isMerged = !isOpen && faker.datatype.boolean(0.8); // 80% of closed are merged

  const closedAt = isOpen
    ? null
    : faker.date.between({ from: createdAt, to: new Date() });
  const mergedAt = isMerged ? closedAt : null;

  const additions = faker.number.int({ min: 10, max: 1500 });
  const deletions = faker.number.int({ min: 5, max: 800 });
  const changedFiles = faker.number.int({ min: 1, max: 30 });

  const id = nextPRId++;
  const number = faker.number.int({ min: 1, max: 999 });

  return {
    id,
    number,
    title: faker.git.commitMessage(),
    body: faker.lorem.paragraph(),
    state: isOpen ? "open" : "closed",
    merged: isMerged,
    created_at: createdAt.toISOString(),
    updated_at: faker.date
      .between({ from: createdAt, to: new Date() })
      .toISOString(),
    closed_at: closedAt?.toISOString() || null,
    merged_at: mergedAt?.toISOString() || null,
    user: author,
    repository: repository,
    html_url: `${repository.html_url}/pull/${id}`,
    head: {
      ref: `feature/${faker.git.branch()}`,
      sha: faker.git.commitSha(),
    },
    base: {
      ref: "main",
      sha: faker.git.commitSha(),
    },
    comments: faker.number.int({ min: 0, max: 15 }),
    review_comments: faker.number.int({ min: 0, max: 25 }),
    commits: faker.number.int({ min: 1, max: 20 }),
    additions,
    deletions,
    changed_files: changedFiles,
  };
}

// ========== SECURITY FINDING GENERATION ==========
const SEVERITY_LEVELS = ["critical", "high", "medium", "low"] as const;
const FINDING_TYPES = [
  "SQL Injection",
  "Cross-Site Scripting (XSS)",
  "Hardcoded Secret",
  "Insecure Deserialization",
  "Path Traversal",
  "Broken Authentication",
  "Security Misconfiguration",
  "Sensitive Data Exposure",
  "Insufficient Logging",
  "CSRF Vulnerability",
];

function generateBotComment(pr: PullRequest): ReviewComment & BotFinding {
  const bot = faker.helpers.arrayElement(BOT_USERS);
  const severity = faker.helpers.arrayElement(SEVERITY_LEVELS);
  const findingType = faker.helpers.arrayElement(FINDING_TYPES);
  const cveId = faker.datatype.boolean(0.3)
    ? `CVE-${faker.date.past().getFullYear()}-${faker.number.int({
        min: 1000,
        max: 9999,
      })}`
    : undefined;

  const commentCreatedAt = faker.date.between({
    from: new Date(pr.created_at),
    to: new Date(),
  });

  const commentId = faker.number.int({ min: 100000, max: 9999999 });
  const body = generateSecurityFindingBody(severity, findingType, cveId);
  const path = faker.system.filePath();
  const line = faker.number.int({ min: 10, max: 500 });
  const commitId = faker.git.commitSha();

  return {
    id: commentId,
    pull_request_review_id: faker.number.int({ min: 1000, max: 9999 }),
    node_id: `MDI0OlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudD${commentId}`,
    user: bot,
    body,
    created_at: commentCreatedAt.toISOString(),
    updated_at: commentCreatedAt.toISOString(),
    path,
    diff_hunk: generateDiffHunk(),
    line,
    side: "RIGHT",
    start_side: "RIGHT",
    position: faker.number.int({ min: 1, max: 50 }),
    original_position: faker.number.int({ min: 1, max: 50 }),
    original_line: line,
    commit_id: commitId,
    original_commit_id: faker.git.commitSha(),
    url: `https://api.github.com/repos/${pr.repository.full_name}/pulls/comments/${commentId}`,
    html_url: `${pr.html_url}#discussion_r${commentId}`,
    pull_request_url: `https://api.github.com/repos/${pr.repository.full_name}/pulls/${pr.number}`,
    _links: {
      self: {
        href: `https://api.github.com/repos/${pr.repository.full_name}/pulls/comments/${commentId}`,
      },
      html: {
        href: `${pr.html_url}#discussion_r${commentId}`,
      },
      pull_request: {
        href: `https://api.github.com/repos/${pr.repository.full_name}/pulls/${pr.number}`,
      },
    },
    author_association: "COLLABORATOR",
    severity,
    finding_type: findingType,
    cve_id: cveId,
  };
}

function generateSecurityFindingBody(
  severity: (typeof SEVERITY_LEVELS)[number],
  findingType: string,
  cveId?: string
): string {
  return `
## 🚨 Security Finding: ${findingType}

**Severity:** ${severity.toUpperCase()}
${cveId ? `**CVE:** ${cveId}\n` : ""}
**CWE:** CWE-${faker.number.int({ min: 1, max: 999 })}

### Description
${faker.lorem.sentences(2)}

### Recommendation
${faker.lorem.sentence()}

### References
- [OWASP Top 10](https://owasp.org/Top10/)
- [CWE Details](https://cwe.mitre.org/)
  `.trim();
}

function generateDiffHunk(): string {
  return `@@ -${faker.number.int({ min: 10, max: 100 })},5 +${faker.number.int({
    min: 10,
    max: 100,
  })},5 @@
- const password = "hardcoded_password";
+ const password = process.env.DB_PASSWORD;
  const connection = db.connect();`;
}

// ========== DEVELOPER RESPONSE GENERATION ==========
function generateDeveloperResponse(
  botComment: ReviewComment,
  prAuthor: User
): ReviewComment | null {
  const hasResponse = faker.datatype.boolean(0.7); // 70% of bot comments get responses
  if (!hasResponse) return null;

  const responseDelay = faker.number.int({ min: 1, max: 72 }); // hours
  const respondedAt = new Date(botComment.created_at);
  respondedAt.setHours(respondedAt.getHours() + responseDelay);

  const responseType = faker.helpers.arrayElement([
    "acknowledged",
    "fixed",
    "disputed",
    "needs_clarification",
  ]);

  const body = generateDeveloperResponseBody(responseType);

  return {
    id: faker.number.int({ min: 100000, max: 9999999 }),
    pull_request_review_id: 12345,
    user: prAuthor,
    body,
    created_at: respondedAt.toISOString(),
    updated_at: respondedAt.toISOString(),
    path: botComment.path,
    line: botComment.line,
    side: botComment.side,
    diff_hunk: botComment.diff_hunk,
    in_reply_to_id: botComment.id,
    commit_id: botComment.commit_id,
    author_association: "OWNER",
  };
}

function generateDeveloperResponseBody(type: ResponseType): string {
  const responses = {
    acknowledged: [
      "Thanks for catching this! Will fix in the next commit.",
      "Acknowledged. Working on a fix now.",
      "Good catch! Updating the code.",
    ],
    fixed: [
      "Fixed in commit abc123.",
      "Resolved. Please review the latest changes.",
      "Done. Updated the implementation as suggested.",
    ],
    disputed: [
      "I don't think this is a real issue because...",
      "This is a false positive. The variable is sanitized earlier in the flow.",
      "Not applicable in this context.",
    ],
    needs_clarification: [
      "Can you clarify what the security concern is here?",
      "Could you provide more details on the recommended fix?",
      "I'm not sure I understand the issue. Can you elaborate?",
    ],
  };

  return faker.helpers.arrayElement(responses[type]);
}

// ========== REVIEW GENERATION ==========
function generateReview(prId: number, prCreatedAt: string): Review {
  const reviewer = faker.helpers.arrayElement([
    ...BOT_USERS,
    ...DEVELOPER_USERS,
  ]);
  const state = faker.helpers.arrayElement([
    "APPROVED",
    "CHANGES_REQUESTED",
    "COMMENTED",
  ]);

  const submittedAt = faker.date.between({
    from: new Date(prCreatedAt),
    to: new Date(),
  });

  return {
    id: faker.number.int({ min: 100000, max: 9999999 }),
    user: reviewer,
    body: faker.lorem.sentence(),
    state,
    submitted_at: submittedAt.toISOString(),
    commit_id: faker.git.commitSha(),
    author_association: reviewer.type === "Bot" ? "COLLABORATOR" : "OWNER",
  };
}

export function generateDashboardData() {
  const prs: PullRequest[] = [];
  const allComments: Map<number, ReviewComment[]> = new Map();
  const allReviews: Map<number, Review[]> = new Map();

  REPOSITORIES.forEach((repo) => {
    const prCount = faker.number.int({ min: 10, max: 30 });

    for (let i = 0; i < prCount; i++) {
      const pr = generatePullRequest(repo);
      prs.push(pr);

      // Generate bot comments (security findings)
      const botCommentCount = faker.number.int({ min: 0, max: 8 });
      const botComments: ReviewComment[] = [];

      for (let j = 0; j < botCommentCount; j++) {
        const botComment = generateBotComment(pr);
        botComments.push(botComment);

        // Generate developer responses
        const devResponse = generateDeveloperResponse(botComment, pr.user);
        if (devResponse) {
          botComments.push(devResponse);
        }
      }

      allComments.set(pr.id, botComments);

      // Generate reviews
      const reviewCount = faker.number.int({ min: 0, max: 3 });
      const reviews: Review[] = Array.from({ length: reviewCount }, () =>
        generateReview(pr.id, pr.created_at)
      );
      allReviews.set(pr.id, reviews);
    }
  });

  return {
    repositories: REPOSITORIES,
    pullRequests: prs,
    comments: allComments,
    reviews: allReviews,
    users: [...BOT_USERS, ...DEVELOPER_USERS],
  };
}

// ========== ENRICHMENT FUNCTIONS ==========
export function enrichPRWithRiskData(
  pr: PullRequest,
  comments: ReviewComment[]
): EnrichedPR {
  const botComments = comments.filter(
    (c) => c.user.type === "Bot"
  ) as (ReviewComment & BotFinding)[];
  const devResponses = comments.filter((c) => c.user.type === "User");

  const severityBreakdown = {
    critical: botComments.filter((c) => c.severity === "critical").length,
    high: botComments.filter((c) => c.severity === "high").length,
    medium: botComments.filter((c) => c.severity === "medium").length,
    low: botComments.filter((c) => c.severity === "low").length,
    none: botComments.filter((c) => c.severity === "none").length,
  };

  const maxSeverity =
    severityBreakdown.critical > 0
      ? "critical"
      : severityBreakdown.high > 0
      ? "high"
      : severityBreakdown.medium > 0
      ? "medium"
      : severityBreakdown.low > 0
      ? "low"
      : "none";

  const developerResponseRate =
    botComments.length > 0 ? devResponses.length / botComments.length : 1;

  const timeOpen =
    (Date.now() - new Date(pr.created_at).getTime()) / (1000 * 60 * 60 * 24);

  const riskAssessment: RiskAssessment = {
    overall_score: calculateRiskScoreForPR(
      pr,
      severityBreakdown,
      developerResponseRate,
      timeOpen
    ),
    severity_breakdown: severityBreakdown,
    factors: {
      findings_count: botComments.length,
      max_severity: maxSeverity,
      lines_changed: pr.additions + pr.deletions,
      developer_response_rate: developerResponseRate,
      time_open: Math.round(timeOpen),
    },
  };

  return {
    ...pr,
    bot_comments: botComments,
    developer_responses: devResponses,
    reviews: [],
    risk_assessment: riskAssessment,
    risk_score: riskAssessment.overall_score,
  };
}

function calculateRiskScoreForPR(
  pr: PullRequest,
  severityBreakdown: SeverityBreakdown,
  devResponseRate: number,
  timeOpen: number
): number {
  let score = 0;

  score += severityBreakdown.critical * 25;
  score += severityBreakdown.high * 15;
  score += severityBreakdown.medium * 5;
  score += severityBreakdown.low * 1;

  if (pr.state === "open") score *= 1.5;
  if (pr.additions + pr.deletions > 500) score *= 1.2;
  if (devResponseRate < 0.5) score *= 1.3;
  if (timeOpen > 7) score *= 1.1;
  if (timeOpen > 30) score *= 1.3;

  return Math.min(Math.round(score), 100);
}
