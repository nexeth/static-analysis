import { DetectorViolation, Severity } from ".";

export interface AnalyserConfig {
  disabledDetectors?: string[];
}

export interface AnalyserResult {
  violations: Record<Severity, DetectorViolation>[];
}
