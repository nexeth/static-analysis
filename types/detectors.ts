import { AnalysisConfig } from "./config";
import { Severity } from "./errors";

export interface AnalysisResult {
  result: boolean;
  // TODO: Add more information about the analysis result
  errors: string[];
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
   * @returns The analysis result.
   */
  detect(code: string, config: AnalysisConfig): Promise<AnalysisResult>;
}
