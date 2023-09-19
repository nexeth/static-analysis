import { BaseASTNode } from "@solidity-parser/parser/dist/src/ast-types";

import { AnalyserConfig, Detector, DetectorViolation, ParsedContracts, Severity } from "@/types";

export type AddViolation = (
  target: string,
  name: string,
  violation: string,
  node: BaseASTNode,
  contract: string
) => void;

export abstract class AbstractDetector implements Detector {
  public abstract id: string;
  public abstract title: string;
  public abstract description: string;
  public abstract severity: Severity;

  abstract detect(code: ParsedContracts, config?: AnalyserConfig): Promise<DetectorViolation[]>;

  _violations(): {
    violations: DetectorViolation[];
    addViolation: AddViolation;
  } {
    const violations: DetectorViolation[] = [];

    const addViolation: AddViolation = (target, name, violation, node, contract) => {
      violations.push({ target, name, violation, node, contract });
    };

    return { violations, addViolation };
  }
}
