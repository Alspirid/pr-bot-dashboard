import { Severity } from "@/types";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface SeverityBadgeProps {
  severity: Severity;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function SeverityBadge({
  severity,
  showIcon = true,
  size = "md",
}: SeverityBadgeProps) {
  const getConfig = (sev: Severity) => {
    switch (sev) {
      case "critical":
        return {
          color: "red" as const,
          icon: AlertTriangle,
          label: "Critical",
          className: "bg-red-100 text-red-800 border-red-300",
        };
      case "high":
        return {
          color: "orange" as const,
          icon: AlertCircle,
          label: "High",
          className: "bg-orange-100 text-orange-800 border-orange-300",
        };
      case "medium":
        return {
          color: "yellow" as const,
          icon: Info,
          label: "Medium",
          className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        };
      case "low":
        return {
          color: "blue" as const,
          icon: CheckCircle,
          label: "Low",
          className: "bg-blue-100 text-blue-800 border-blue-300",
        };
      default:
        return {
          color: "gray" as const,
          icon: CheckCircle,
          label: "None",
          className: "bg-gray-100 text-gray-600 border-gray-300",
        };
    }
  };

  const config = getConfig(severity);
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
      {showIcon && <Icon className={iconSizes[size]} />}
      {config.label}
    </span>
  );
}
