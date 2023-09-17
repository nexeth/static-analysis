export type Severity = "informational" | "low" | "medium" | "high" | "critical";

export const Severity = {
  Informational: "informational" as Severity,
  Low: "low" as Severity,
  Medium: "medium" as Severity,
  High: "high" as Severity,
  Critical: "critical" as Severity,
} as const;
