import { AbstractDetector } from "./abstract-detector";

import { SolidityParser } from "@/modules";
import { DetectorViolation, ParsedContracts, SeverityValue } from "@/types";

export const SHIFT_PARAMETER_MIXUP = "incorrect-shift";

export class ShiftParameterMixupDetector extends AbstractDetector {
  public id = SHIFT_PARAMETER_MIXUP;
  public title = "Incorrect shift in assembly.";
  public description = "The order of parameters in a shift instruction is incorrect.";
  public severity = SeverityValue.High;

  detect(code: ParsedContracts): Promise<DetectorViolation[]> {
    const { violations, addViolation } = this._violations();

    const contracts = SolidityParser.getContracts(code);
    contracts.forEach((contract) => {
      const functions = SolidityParser.getFunctions([contract]);
      functions.map((func) => {
        func.body?.statements.forEach((statement) => {
          SolidityParser.visit(statement, {
            AssemblyCall: (node) => {
              if (node.functionName === "shr" || node.functionName === "shl") {
                const [firstParam, secondParam] = node.arguments;
                if (firstParam.type === "AssemblyCall" && secondParam.type === "DecimalNumber") {
                  addViolation({
                    message: `function ${func.name} contains an incorrect shift operation`,
                    node,
                    contract: contract.name,
                  });
                }
              }
            },
          });
        });
      });
    });

    return Promise.resolve(violations);
  }
}
