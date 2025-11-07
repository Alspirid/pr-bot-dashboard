import { Circle, CircleX, GitMerge, GitPullRequest } from "lucide-react";

type PRStatus = "open" | "closed" | "merged";

interface StatusBadgeProps {
  status: PRStatus;
  merged?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function StatusBadge({
  status,
  merged = false,
  size = "md",
}: StatusBadgeProps) {
  const getConfig = () => {
    if (status === "closed" && merged) {
      return {
        icon: GitMerge,
        label: "Merged",
        className: "bg-purple-100 text-purple-800 border-purple-300",
      };
    }

    switch (status) {
      case "open":
        return {
          icon: GitPullRequest,
          label: "Open",
          className: "bg-green-100 text-green-800 border-green-300",
        };
      case "closed":
        return {
          icon: CircleX,
          label: "Closed",
          className: "bg-red-100 text-red-800 border-red-300",
        };
      case "merged":
        return {
          icon: GitMerge,
          label: "Merged",
          className: "bg-purple-100 text-purple-800 border-purple-300",
        };
      default:
        return {
          icon: Circle,
          label: "Unknown",
          className: "bg-gray-100 text-gray-600 border-gray-300",
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${config.className}
        ${sizeClasses[size]}
      `}
    >
      <Icon className={iconSizes[size]} />
      {config.label}
    </span>
  );
}
