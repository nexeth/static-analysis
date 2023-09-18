export type Severity = "informational" | "low" | "medium" | "high" | "optimization";

export const SeverityValue = {
  Informational: "informational" as Severity,
  Low: "low" as Severity,
  Medium: "medium" as Severity,
  High: "high" as Severity,
  Optimization: "optimization" as Severity,
} as const;
