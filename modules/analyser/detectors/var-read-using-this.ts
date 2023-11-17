import { AbstractDetector } from "./abstract-detector";

import { SolidityParser } from "@/modules";
import { DetectorViolation, ParsedContracts, SeverityValue } from "@/types";

export const VAR_READ_USING_THIS_DETECTOR = "var-read-using-this";

export class VarReadUsingThisDetector extends AbstractDetector {
  public id = VAR_READ_USING_THIS_DETECTOR;
  public title = "Contract reads its own variable using `this`";
  public description =
    "The contract reads its own variable using `this`, adding overhead of an unnecessary STATICCALL.";
  public severity = SeverityValue.Optimization;

  detect(
    code: ParsedContracts
    // config: AnalyserConfig = {}
  ): Promise<DetectorViolation[]> {
    const { violations, addViolation } = this._violations();

    const contracts = SolidityParser.getContracts(code);

    contracts.forEach((contract) => {
      const functions = SolidityParser.getFunctions([contract]);
      functions.map((func) => {
        func.body?.statements.forEach((statement) => {
          SolidityParser.visit(statement, {
            Identifier: (node) => {
              if (node.name === "this") {
                addViolation({
                  message: `function ${func.name} reads variable using \`this\``,
                  node,
                  contract: contract.name,
                });
              }
            },
          });
        });
      });
    });

    return Promise.resolve(violations);
  }
}
