import { Card, Text } from "@tremor/react";
import { AlertCircle, FileX, Inbox, Search } from "lucide-react";

interface EmptyStateProps {
  type?: "no-data" | "no-results" | "error" | "default";
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

function EmptyState({
  type = "default",
  title,
  description,
  action,
}: EmptyStateProps) {
  const config = {
    "no-data": {
      icon: FileX,
      defaultTitle: "No Data Available",
      defaultDescription: "There are no items to display at this time.",
      iconColor: "text-gray-400",
    },
    "no-results": {
      icon: Search,
      defaultTitle: "No Results Found",
      defaultDescription: "Try adjusting your filters or search query.",
      iconColor: "text-blue-400",
    },
    error: {
      icon: AlertCircle,
      defaultTitle: "Something Went Wrong",
      defaultDescription: "We couldn't load the data. Please try again.",
      iconColor: "text-red-400",
    },
    default: {
      icon: Inbox,
      defaultTitle: "Nothing Here",
      defaultDescription: "This section is empty.",
      iconColor: "text-gray-400",
    },
  };

  const {
    icon: Icon,
    defaultTitle,
    defaultDescription,
    iconColor,
  } = config[type];

  return (
    <Card className="flex items-center justify-center py-12">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <Icon className={`w-16 h-16 ${iconColor}`} />
        </div>
        <Text className="text-xl font-semibold text-gray-900 mb-2">
          {title || defaultTitle}
        </Text>
        <Text className="text-gray-600 mb-4">
          {description || defaultDescription}
        </Text>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </Card>
  );
}

export function NoPRsFound({
  onClearFilters,
}: {
  onClearFilters?: () => void;
}) {
  return (
    <EmptyState
      type="no-results"
      title="No Pull Requests Found"
      description="No PRs match your current filters. Try adjusting your search criteria."
      action={
        onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        )
      }
    />
  );
}
