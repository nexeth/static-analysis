import { AbstractDetector } from "./abstract-detector";

import { SolidityParser } from "@/modules";
import { DetectorViolation, ParsedContracts, SeverityValue } from "@/types";

export const SUICIDAL = "suicidal";

export class SuicidalDetector extends AbstractDetector {
  public id = SUICIDAL;
  public title = "Suicidal";
  public description = "Unprotected call to a function executing `selfdestruct`/`suicide`.";
  public severity = SeverityValue.High;

  detect(code: ParsedContracts): Promise<DetectorViolation[]> {
    const { violations, addViolation } = this._violations();

    SolidityParser.visit(code, {
      FunctionDefinition: (node) => {
        if (node.body) {
          SolidityParser.visit(node.body, {
            FunctionCall: (callNode) => {
              if (callNode.expression.type === "Identifier" && callNode.expression.name === "selfdestruct") {
                if (SolidityParser.isProtectedFunction(node)) return;

                addViolation({
                  message: "function contains an unprotected selfdestruct",
                  node,
                  contract: "contract",
                });
              }
            },
          });
        }
      },
    });

    return Promise.resolve(violations);
  }
}
