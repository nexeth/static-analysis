import { Logger } from "../logger";

import { detectors } from "./detectors";

import { AnalyserConfig, DetectorViolation, ParsedContracts, Severity } from "@/types";

/**
 * A service for detecting vulnerabilities in Solidity code.
 */
export class SolidityAnalyser {
  private config: AnalyserConfig;

  constructor(config: AnalyserConfig = {}) {
    this.config = config;
  }

  async analyse(code: ParsedContracts): Promise<void> {
    const violations: Record<Severity, DetectorViolation[]> = {
      high: [],
      medium: [],
      low: [],
      informational: [],
      optimization: [],
    };

    await Promise.all(
      detectors.map(async (Detector) => {
        const detector = new Detector();
        const _violations = await detector.detect(code, this.config);
        violations[detector.severity].push(..._violations);

        _violations.forEach((violation) => {
          Logger.error(
            `[${detector.severity.toUpperCase()}] - [${detector.id}]- ${violation.target} ${violation.name} - ${
              violation.violation
            }`
          );
        });
      })
    );

    const totalViolations = Object.values(violations).reduce((acc, curr) => acc + curr.length, 0);
    if (totalViolations === 0) {
      Logger.info("No violations detected");
    }

    Logger.info(
      `Results: Detected ${totalViolations} violations
    High: ${violations.high.length}
    Medium: ${violations.medium.length}
    Low: ${violations.low.length}
    Informational: ${violations.informational.length}
    Optimization: ${violations.optimization.length}
    `
    );
  }
}
