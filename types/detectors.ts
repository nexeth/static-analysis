import { AnalysisConfig } from "./config";
import { Severity } from "./errors";
import * as parser from "@solidity-parser/parser";

export type ParsedContract = ReturnType<typeof parser.parse>;

export interface DetectorViolation {
  target: string;
  name: string;
  convention: string;
}

export interface Detector {
  /**
   * The name of the detector as it will be used in the configuration.
   */
  id: string;

  /**
   * The name of the detector as it will be displayed in the UI.
   */
  title: string;

  /**
   * A description of the detector.
   */
  description: string;

  /**
   * The severity of the detector.
   */
  severity: Severity;

  /**
   * Analyzes the given code with the provided configuration and returns an analysis result.
   * @param code The code to analyze.
   * @param config The configuration to use for the analysis.
   * @returns Violations of the
   */
  detect(
    code: ParsedContract,
    config: AnalysisConfig
  ): Promise<DetectorViolation[]>;
}
