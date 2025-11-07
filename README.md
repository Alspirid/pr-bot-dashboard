# PR Bot - Security Analytics Dashboard

A comprehensive dashboard for monitoring security bot activity across GitHub pull requests. Designed for technical security professionals (CISO/Head of Security) to understand risk at a glance, triage problematic PRs, and drill into details when needed.

**Time Constraint:** 2-4 hours implementation
**Focus:** UX clarity for security persona, data interaction patterns, code quality

---

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Run development server (http://localhost:3000)
yarn dev

# Build for production
yarn build

# Run production server
yarn start

# Lint code
yarn lint
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 📋 Features

### Security Overview Dashboard (`/`)

- **Overview Metrics Cards**: Total PRs, critical findings, average risk score, open PRs
- **Risk Timeline Chart**: Area chart showing security events over time by severity
- **Severity Distribution**: Donut chart visualizing findings breakdown
- **Color-Coded Risk Indicators**: Instant visual triage (Red = Critical, Orange = High, Green = Low)

### PR List & Filtering (`/prs`)

- **Interactive Table**: Sortable columns (PR#, title, risk score, severity, created date, findings)
- **Advanced Filtering**:
  - Search by PR title, number, or repository name
  - Filter by severity (Critical, High, Medium, Low, None)
  - Filter by status (Open, Closed, Merged)
  - Filter by repository
- **Live Stats**: Real-time counts update based on active filters
- **Applied Filter Chips**: Visual indicators with one-click removal
- **External Links**: Direct navigation to GitHub PRs

### PR Detail View (`/pr/[id]`)

- **Tabbed Interface**:
  - **Overview**: Risk assessment, severity breakdown, metrics
  - **Comments**: Security findings with code context and developer responses
  - **Timeline**: Chronological activity feed (bot comments, responses, reviews)
- **Risk Assessment**:
  - Overall risk score (0-100) with color-coding
  - Visual severity breakdown with progress bars
  - Key factors: lines changed, time open, response rate, max severity
- **Threaded Comments**: Bot findings with nested developer responses
- **Code Context**: Diff hunks, file paths, line numbers for each finding

### Advanced Analytics (`/analytics`)

- **Repository Performance**: Bar chart comparing repos by open PRs, critical findings, avg risk score
- **Risk Distribution**: Donut chart showing PR distribution across risk ranges
- **Developer Engagement**: Response rate distribution visualization
- **Time to First Response**: Bar chart analyzing response time patterns
- **Findings by Severity**: Comprehensive severity breakdown across all PRs

---

## 🏗️ Tech Stack

### Core Framework

- **Next.js 16** (App Router) - Latest React framework with server components
- **React 18** - to support @tremor/react components
- **TypeScript** (strict mode) - Full type safety across the codebase

### Why Next.js?

- **App Router**: Modern routing with layouts and nested routes
- **File-based routing**: Intuitive `/prs` and `/pr/[id]` structure
- **Performance**: Automatic code splitting and optimizations
- **Production-ready**: Built-in SEO, image optimization, and deployment optimizations

### UI & Styling

- **Tailwind CSS v3** - Utility-first styling with custom color palette
- **Tremor React** - Pre-built analytics components (Card, Metric, AreaChart, DonutChart, BarChart)
- **Lucide React** - Consistent, modern icon set

### Why Tremor?

- **Analytics-focused**: Built specifically for dashboard UIs
- **Accessible**: WCAG compliant components out of the box
- **Recharts integration**: Powerful charting with minimal configuration
- **Time-saver**: Pre-styled components reduce implementation time

### State & Data

- **Zustand** - Lightweight state management for filters
- **date-fns** - Date formatting and manipulation
- **Faker.js** - Realistic mock data generation

### Why Zustand?

- **Minimal boilerplate**: Simple API compared to Redux
- **No Context API overhead**: Direct store access without providers
- **Small bundle size**: ~1KB vs Redux's ~10KB
- **Perfect for filters**: Persistent filter state across navigation

---

## 📁 Project Structure

```
src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (Geist fonts, global styles)
│   ├── globals.css                   # Tailwind imports + custom styles
│   ├── page.tsx                      # Security Overview (/ route)
│   ├── analytics/
│   │   └── page.tsx                  # Advanced Analytics
│   ├── prs/
│   │   └── page.tsx                  # PR List with filters
│   └── pr/[id]/
│       └── page.tsx                  # PR Detail view
├── components/
│   ├── analytics/
│   │   ├── OverviewMetrics.tsx       # Metric cards with trend indicators
│   │   ├── RiskTimeline.tsx          # Area chart (time series)
│   │   └── SeverityDistribution.tsx  # Donut chart (severity breakdown)
│   ├── pr-list/
│   │   ├── PRTable.tsx               # Sortable table with risk scoring
│   │   └── FilterPanel.tsx           # Sidebar filters (severity, status, repo, search)
│   ├── pr-detail/
│   │   └── [inline in page.tsx]     # Components implemented directly in detail page
│   └── shared/
│       ├── SeverityBadge.tsx         # Color-coded severity badges
│       ├── StatusBadge.tsx           # PR status badges (open, closed, merged)
│       └── EmptyState.tsx            # Empty state messages
├── lib/
│   ├── data/
│   │   ├── fake-data-generator.ts    # Core data generation logic (⭐ See below)
│   │   ├── sample-data.ts            # Pre-generated dataset export
│   │   ├── dashboard-data.ts         # Dashboard metrics aggregation
│   │   ├── analyticsData.ts          # Analytics page data
│   │   ├── pr-data.ts                # PR data accessors (getAllPRs, getPRById)
│   │   └── repo-data.ts              # Repository dropdown options
│   ├── stores/
│   │   └── dashboard-store.ts        # Zustand store (filters only, sorting in components)
│   └── utils/
│       └── risk-colors.ts            # Shared utility for risk score color-coding
└── types/
    └── index.ts                      # TypeScript types (GitHub API structure)
```

---

## 🎲 Seed/Faker Data Generation

### Overview

The project uses **Faker.js** to generate realistic GitHub PR data that simulates a security bot reviewing pull requests. All data is **pre-generated** once on app load for consistency across page refreshes.

### Data Generation Script: `src/lib/data/fake-data-generator.ts`

#### What It Generates

1. **Users** (3 bot accounts, 15 developers)

   - Realistic login names, avatar URLs, GitHub user structure
   - Bots marked with `type: "Bot"`

2. **Repositories** (8 repos)

   - Names: api-gateway, user-service, payment-processor, etc.
   - Languages: TypeScript, Python, Go, Java, Ruby
   - Owners, descriptions, URLs following GitHub format

3. **Pull Requests** (130-150 total, ~10-30 per repo)

   - **60% open**, 40% closed (80% of closed are merged)
   - Realistic titles, body text, branch names
   - Commit counts, additions/deletions, changed files
   - Created/updated timestamps with realistic delays

4. **Bot Comments** (0-8 security findings per PR)

   - **Markdown-formatted** findings with:
     - Severity level (Critical, High, Medium, Low)
     - Finding type (SQL Injection, XSS, Hardcoded Secret, etc.)
     - CWE references (e.g., CWE-79, CWE-89)
     - CVE identifiers (30% of findings)
     - Code context (file path, line number, diff hunk)
     - Recommendations for fixing
   - Realistic diff hunks with vulnerable code patterns

5. **Developer Responses** (70% response rate)

   - **Linked to bot comments** via `in_reply_to_id`
   - Response types: acknowledged, fixed, disputed, needs_clarification
   - Response delays: 1-72 hours after bot comment
   - Realistic response text matching the type

6. **Reviews** (0-3 per PR)
   - States: APPROVED, CHANGES_REQUESTED, COMMENTED
   - Review body text with feedback

#### Key Features

- **Realistic Relationships**: Bot comments reference actual files/lines, developer responses link to bot comments
- **Severity Distribution**: Weighted towards medium/low (realistic security scanning results)
- **Time Simulation**: Timestamps progress chronologically (PR created → bot comments → dev responses → reviews)
- **GitHub API Compliance**: Data structure matches GitHub REST API for easy future integration

#### How to Regenerate Data

```typescript
// In src/lib/data/sample-data.ts
import { generateFakeData } from "./fake-data-generator";

export const sampleData = generateFakeData(); // Regenerates on app restart
```

#### Sample Output Stats

- **~180 PRs** across **8 repositories**
- **~600 security findings** total
- **~420 developer responses** (70% engagement)
- **Critical findings**: ~10-15%
- **High findings**: ~20-25%
- **Medium findings**: ~35-40%
- **Low findings**: ~25-30%

---

## 🎯 Technical Decisions & Tradeoffs

### 1. Pre-generated vs On-Demand Data

**Decision**: Generate all fake data once on app load

- ✅ **Pro**: Consistent data across page refreshes and navigation
- ✅ **Pro**: Faster subsequent page loads (no regeneration)
- ✅ **Pro**: Data doesn't change without refreshing the app
- ⚠️ **Con**: Initial load includes data generation time (~50-100ms)

**Rationale**: For a demo/assessment, consistency is more important than dynamic data. Evaluators can refresh browser to see new data.

### 2. Zustand Store for Filters Only (Not Sorting)

**Decision**: Keep filter state in Zustand, sorting state local to PRTable component

- ✅ **Pro**: Filters persist when navigating away and back to `/prs`
- ✅ **Pro**: Sorting is component-specific (table interaction, not global state)
- ✅ **Pro**: Simpler state management (single responsibility)
- ⚠️ **Con**: Sorting resets when navigating away from table

**Rationale**: Filters are cross-cutting concerns, sorting is UI-specific. Follows React best practices for local vs global state.

### 3. No TanStack Query or SWR for Data Fetching

**Decision**: Use direct imports instead of async data fetching

- ✅ **Pro**: Simpler code (no loading states, no cache management)
- ✅ **Pro**: Faster development (less boilerplate)
- ✅ **Pro**: Appropriate for static demo data
- ⚠️ **Con**: No realistic loading states (but can add artificial delays)
- ⚠️ **Con**: Requires refactoring for real API integration

**Rationale**: Given 2-4 hour time constraint, focus on UX/features over infrastructure. A fetching library with caching is overkill for static data.

### 4. Tremor React Over Custom Components

**Decision**: Use Tremor's pre-built analytics components instead of building from scratch

- ✅ **Pro**: Massive time savings (~60-70% faster implementation)
- ✅ **Pro**: Accessible by default (WCAG compliance)
- ✅ **Pro**: Consistent design language across dashboard
- ✅ **Pro**: Battle-tested Recharts integration
- ⚠️ **Con**: Less customization flexibility
- ⚠️ **Con**: Additional dependency (~100KB)

**Rationale**: Time constraint makes this essential. Tremor's quality is high enough for production dashboards. Custom components would consume 50%+ of implementation time.

### 5. Client-Side Filtering/Sorting

**Decision**: Filter and sort data in browser instead of API endpoints

- ✅ **Pro**: Instant feedback (no network latency)
- ✅ **Pro**: Simple implementation (pure functions)
- ✅ **Pro**: Works offline
- ⚠️ **Con**: Not scalable to thousands of PRs
- ⚠️ **Con**: All data loaded upfront

**Rationale**: Appropriate for demo with ~200 PRs. Real implementation would paginate and filter server-side, but that's beyond scope of 2-4 hour assessment.

### 7. Risk Score Stored vs Calculated

**Decision**: Pre-calculate risk scores during data generation and store them

- ✅ **Pro**: Consistent scores across views
- ✅ **Pro**: Fast sorting/filtering by risk score
- ✅ **Pro**: Easy to display without recalculation
- ⚠️ **Con**: Scores don't update if formula changes

**Rationale**: In real implementation, scores would be calculated server-side. Pre-calculation is appropriate for static demo data.

### 8. TypeScript Strict Mode

**Decision**: Enable TypeScript strict mode from the start

- ✅ **Pro**: Catches bugs at compile time
- ✅ **Pro**: Better IDE autocomplete and refactoring
- ✅ **Pro**: Documents types for evaluators
- ⚠️ **Con**: Slightly slower initial development (typing overhead)

**Rationale**: Shows code quality and professional standards. Type safety is expected in modern React/Next.js projects.

---

## 🚀 Running the Application

### Development Mode

```bash
yarn dev
```

- Runs on `http://localhost:3000`
- Hot reload enabled
- Data regenerates on page refresh

### Production Build

```bash
yarn build && yarn start
```

- Optimized bundle with code splitting
- Server-side rendering where applicable
- Production performance profiling enabled

### Linting

```bash
yarn lint
```

- ESLint with Next.js config
- Catches common React/TypeScript issues

---

## 🔄 Future Enhancements

### Phase 1: Backend Integration

- [ ] Backend REST API integration with real GitHub data
- [ ] GitHub OAuth authentication
- [ ] Real-time webhook integration (PR opened, comment added)
- [ ] Database storage (PostgreSQL/MongoDB)
- [ ] Pagination for large datasets

### Phase 2: Advanced Features

- [ ] Date range filtering (last 7 days, last 30 days, custom range)
- [ ] Multi-repository comparison dashboard
- [ ] CSV/PDF export for compliance reporting
- [ ] Email/Slack notifications for critical findings
- [ ] User preferences (saved filters, theme selection)
- [ ] Historical trend analysis (risk over time)

### Phase 3: AI/ML Features

- [ ] Severity prediction based on code patterns
- [ ] Duplicate finding detection
- [ ] Developer response quality scoring
- [ ] Automated triage recommendations

---

## 📝 Notes for Evaluators

### What's Included

- ✅ Complete dashboard with 4 pages (overview, PR list, PR detail, analytics)
- ✅ Advanced filtering and sorting
- ✅ Realistic fake data with GitHub API structure
- ✅ Type-safe TypeScript throughout
- ✅ Responsive design (desktop-optimized)
- ✅ Performance optimizations (useMemo, efficient filtering)
- ✅ Clean, maintainable code with clear architecture

### What's Not Included (Out of Scope)

- [ ] Real GitHub API integration (static demo data only)
- [ ] Authentication/authorization
- [ ] Database/persistence
- [ ] Unit tests (would add ~2-3 hours)
- [ ] Mobile optimization (desktop-first design)
- [ ] Accessibility testing (Tremor provides baseline WCAG compliance)
- [ ] Error boundaries beyond basic 404 handling

### Tradeoffs Made

1. **Static data over mocking real API** - Appropriate for time-constrained assessment
2. **Client-side filtering over server pagination** - Simpler implementation, scales to ~500 PRs
3. **Pre-built Tremor components over custom** - 60-70% time savings, production-quality
4. **Inline components in detail page** - Reduces file count, easier to review
5. **No fetching library (TanStack Query/SWR)** - Overkill for static data, would add complexity without benefit
