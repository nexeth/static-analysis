import { ExpressionStatement } from "@solidity-parser/parser/dist/src/ast-types";

import { AbstractDetector } from "./abstract-detector";

import { SolidityParser } from "@/modules";
import { DetectorViolation, ParsedContracts, SeverityValue } from "@/types";

export const VAR_READ_USING_THIS = "var-read-using-this";

export class VarReadUsingThisDetector extends AbstractDetector {
  public id = VAR_READ_USING_THIS;
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
        console.log(func);
        func.body?.statements.forEach((statement) => {
          if (statement.type === "ExpressionStatement") {
            const { expression } = statement as ExpressionStatement;
            if (!expression) return;
            // TODO determine other operations that may be able to use a this statement
            if (expression.type !== "BinaryOperation") return;
            if (expression.right.type !== "MemberAccess") return;
            if (expression.right.expression.type !== "Identifier") return;

            addViolation("function", func.name ?? "unknown", "function reads this", func, contract.name);
          }
        });
      });
    });

    return Promise.resolve(violations);
  }
}
