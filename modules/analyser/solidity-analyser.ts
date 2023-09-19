import { Logger } from "../logger";

import { detectors } from "./detectors";

import { AnalyserConfig, DetectorViolation, ParsedContracts, Severity } from "@/types";

const baseDir = process.cwd();

/**
 * A service for detecting vulnerabilities in Solidity code.
 */
export class SolidityAnalyser {
  private config: AnalyserConfig;
  private files: string[] = [];

  constructor(config: AnalyserConfig = {}) {
    this.config = config;
  }

  /**
   * Analyzes the given Solidity code and returns a map of violations
   * @param code The parsed AST of the Solidity code to analyze.
   * @returns A map of severity to violations.
   */
  async analyse(code: ParsedContracts, file: string): Promise<Record<Severity, DetectorViolation[]>> {
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
          Logger.violation({
            violation,
            detectorId: detector.id,
            severity: detector.severity,
            fileOptions: { file, baseDir },
          });
        });
      })
    );

    const totalViolations = Object.values(violations).reduce((acc, curr) => acc + curr.length, 0);
    if (totalViolations === 0) {
      Logger.info("No violations detected");
    }

    Logger.info(
      `Results: Detected ${totalViolations} violations
    HIGH: ${violations.high.length}
    MEDIUM: ${violations.medium.length}
    LOW: ${violations.low.length}
    INFORMATION: ${violations.informational.length}
    OPTIMIZATION: ${violations.optimization.length}
    `
    );

    return violations;
  }
}
