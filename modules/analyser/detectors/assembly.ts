import { AbstractDetector } from "./abstract-detector";

import { SolidityParser } from "@/modules";
import { DetectorViolation, ParsedContracts, SeverityValue } from "@/types";

export const ASSEMBLY_DETECTOR = "assembly";

export class AssemblyDetector extends AbstractDetector {
  public id = ASSEMBLY_DETECTOR;
  public title = "Assembly usage";
  public description = "The use of assembly is error-prone and should be avoided.";
  public severity = SeverityValue.Informational;

  detect(code: ParsedContracts): Promise<DetectorViolation[]> {
    const { violations, addViolation } = this._violations();

    const contracts = SolidityParser.getContracts(code);
    contracts.forEach((contract) => {
      const functions = SolidityParser.getFunctions([contract]);
      functions.forEach((func) => {
        SolidityParser.visit(func, {
          InlineAssemblyStatement: (node) => {
            addViolation({
              message: `function ${func.name} contains assembly`,
              node,
              contract: contract.name,
            });
          },
        });
      });
    });
    return Promise.resolve(violations);
  }
}
