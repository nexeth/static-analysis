import * as parser from "@solidity-parser/parser";
import { BaseASTNode } from "@solidity-parser/parser/dist/src/ast-types";

import { AnalyserConfig } from "./analyser";
import { Severity } from "./errors";

export type ParsedContracts = ReturnType<typeof parser.parse>;

export interface DetectorViolation {
  /**
   * The type of the target of the violation.
   */
  target: string;
  /**
   * The name of the target of the violation.
   */
  name: string;
  /**
   * Details on the convention that was violated. This is used to inform the error message
   */
  violation: string;
  /**
   * The node in the AST that caused the violation.
   */
  node: BaseASTNode;
  /**
   * The contract that the violation occurred in.
   */
  contract: string;
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
  detect(code: ParsedContracts, config?: AnalyserConfig): Promise<DetectorViolation[]>;
}
