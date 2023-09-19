import { BaseASTNode } from "@solidity-parser/parser/dist/src/ast-types";

import { AnalyserConfig, Detector, DetectorViolation, ParsedContracts, Severity } from "@/types";

export type AddViolationProps = {
  message: string;
  node: BaseASTNode;
  contract: string;
};

export abstract class AbstractDetector implements Detector {
  public abstract id: string;
  public abstract title: string;
  public abstract description: string;
  public abstract severity: Severity;

  abstract detect(code: ParsedContracts, config?: AnalyserConfig): Promise<DetectorViolation[]>;

  _violations(): {
    violations: DetectorViolation[];
    addViolation: (props: AddViolationProps) => void;
  } {
    const violations: DetectorViolation[] = [];

    const addViolation = ({ message, node, contract }: AddViolationProps) => {
      violations.push({ message, node, contract });
    };

    return { violations, addViolation };
  }
}
