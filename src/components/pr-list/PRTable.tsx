"use client";

import SeverityBadge from "@/components/shared/SeverityBadge";
import StatusBadge from "@/components/shared/StatusBadge";
import { getRiskScoreColor } from "@/lib/utils/risk-colors";
import { EnrichedPR } from "@/types";
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
} from "@tremor/react";
import { format } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SortField =
  | "number"
  | "title"
  | "risk_score"
  | "severity"
  | "created_at"
  | "findings";
type SortOrder = "asc" | "desc";

type PRTableProps = {
  pullRequests: EnrichedPR[];
};

type SortIconProps = {
  sortField: SortField;
  field: SortField;
  sortOrder: SortOrder;
};

const SortIcon = ({ sortField, field, sortOrder }: SortIconProps) => {
  if (sortField !== field) {
    return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
  }
  return sortOrder === "asc" ? (
    <ArrowUp className="w-4 h-4 text-blue-600" />
  ) : (
    <ArrowDown className="w-4 h-4 text-blue-600" />
  );
};

type SortableHeaderProps = {
  field: SortField;
  children: React.ReactNode;
  onClick: (field: SortField) => void;
  sortOrder: SortOrder;
  sortField: SortField;
};

const SortableHeader = ({
  field,
  children,
  onClick,
  sortOrder,
  sortField,
}: SortableHeaderProps) => (
  <TableHeaderCell
    onClick={() => onClick(field)}
    className="cursor-pointer hover:bg-gray-50 select-none !px-2 !py-2"
  >
    <div className="flex items-center gap-1">
      {children}
      <SortIcon sortField={sortField} field={field} sortOrder={sortOrder} />
    </div>
  </TableHeaderCell>
);

function PRTable({ pullRequests }: PRTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>("risk_score");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const sortedPRs = [...pullRequests].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;

    switch (sortField) {
      case "number":
        aVal = a.id;
        bVal = b.id;
        break;
      case "title":
        aVal = a.title.toLowerCase();
        bVal = b.title.toLowerCase();
        break;
      case "risk_score":
        aVal = a.risk_score || 0;
        bVal = b.risk_score || 0;
        break;
      case "severity":
        const severityOrder = {
          critical: 4,
          high: 3,
          medium: 2,
          low: 1,
          none: 0,
        };
        aVal = severityOrder[a.risk_assessment.factors.max_severity];
        bVal = severityOrder[b.risk_assessment.factors.max_severity];
        break;
      case "created_at":
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
        break;
      case "findings":
        aVal = a.risk_assessment.factors.findings_count;
        bVal = b.risk_assessment.factors.findings_count;
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <SortableHeader
                field="number"
                sortField={sortField}
                sortOrder={sortOrder}
                onClick={handleSort}
              >
                PR #
              </SortableHeader>
              <SortableHeader
                field="title"
                sortField={sortField}
                sortOrder={sortOrder}
                onClick={handleSort}
              >
                Title
              </SortableHeader>
              <TableHeaderCell className="!px-2 !py-2">
                Repository
              </TableHeaderCell>
              <SortableHeader
                field="risk_score"
                sortField={sortField}
                sortOrder={sortOrder}
                onClick={handleSort}
              >
                Risk Score
              </SortableHeader>
              <SortableHeader
                field="severity"
                sortField={sortField}
                sortOrder={sortOrder}
                onClick={handleSort}
              >
                Max Severity
              </SortableHeader>
              <TableHeaderCell className="!px-2 !py-2">Status</TableHeaderCell>
              <SortableHeader
                field="findings"
                sortField={sortField}
                sortOrder={sortOrder}
                onClick={handleSort}
              >
                Findings
              </SortableHeader>
              <SortableHeader
                field="created_at"
                sortField={sortField}
                sortOrder={sortOrder}
                onClick={handleSort}
              >
                Created
              </SortableHeader>
              <TableHeaderCell className="!px-2 !py-2"></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedPRs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <Text className="text-gray-500">No pull requests found</Text>
                </TableCell>
              </TableRow>
            ) : (
              sortedPRs.map((pr) => (
                <TableRow
                  key={`${pr.repository.name}-${pr.id}-${pr.title}`}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => router.push(`/pr/${pr.id}`)}
                >
                  <TableCell className="font-mono text-sm !px-2 !py-2">
                    {pr.id}
                  </TableCell>
                  <TableCell className="max-w-md !px-2 !py-2">
                    <div className="truncate font-medium">{pr.title}</div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">
                      {pr.user.login}
                    </div>
                  </TableCell>
                  <TableCell className="!px-2 !py-2">
                    <Badge size="xs" color="gray">
                      {pr.repository.name}
                    </Badge>
                  </TableCell>
                  <TableCell className="!px-2 !py-2">
                    <span
                      className={`text-lg font-semibold ${getRiskScoreColor(
                        pr.risk_score || 0
                      )}`}
                    >
                      {pr.risk_score || 0}
                    </span>
                  </TableCell>
                  <TableCell className="!px-2 !py-2">
                    <SeverityBadge
                      severity={pr.risk_assessment.factors.max_severity}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="!px-2 !py-2">
                    <StatusBadge
                      status={pr.state}
                      merged={pr.merged}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell className="!px-2 !py-2">
                    <div className="flex flex-col gap-0.5 items-center">
                      <span className="font-semibold">
                        {pr.risk_assessment.factors.findings_count}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 !px-2 !py-2">
                    {format(new Date(pr.created_at), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="!px-2 !py-2">
                    <a
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default PRTable;
