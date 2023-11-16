import { AbstractDetector } from "./abstract-detector";

import { SolidityParser } from "@/modules";
import { DetectorViolation, ParsedContracts, SeverityValue } from "@/types";

export const MULTIPLE_CONSTRUCTORS = "multiple-constructors";

export class MultipleConstructorsDetector extends AbstractDetector {
  public id = MULTIPLE_CONSTRUCTORS;
  public title = "Multiple Constructors";
  public description = "Detected multiple constructor definitions in the same contract";
  public severity = SeverityValue.High;

  detect(
    code: ParsedContracts
    // config: AnalyserConfig = {}
  ): Promise<DetectorViolation[]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
