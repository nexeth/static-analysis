import { AbstractDetector } from "./abstract-detector";

import { SolidityParser } from "@/modules";
import { DetectorViolation, ParsedContracts, SeverityValue } from "@/types";

export const MULTIPLE_CONSTRUCTORS_DETECTOR = "multiple-constructors";

export class MultipleConstructorsDetector extends AbstractDetector {
  public id = MULTIPLE_CONSTRUCTORS_DETECTOR;
  public title = "Multiple Constructors";
  public description = "Detected multiple constructor definitions in the same contract";
  public severity = SeverityValue.High;

  detect(code: ParsedContracts): Promise<DetectorViolation[]> {
    const { violations, addViolation } = this._violations();

    const contracts = SolidityParser.getContracts(code);
    contracts.forEach((contract) => {
      let hasConstructor = false;

      SolidityParser.visit(contract, {
        FunctionDefinition: (node) => {
          if (node.isConstructor) {
            if (hasConstructor) {
              addViolation({
                message: "multiple constructor definitions detected",
                node,
                contract: contract.name,
              });
            } else {
              hasConstructor = true;
            }
          }
        },
      });
    });

    return Promise.resolve(violations);
  }
}
