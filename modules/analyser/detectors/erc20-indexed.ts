import { AbstractDetector } from "./abstract-detector";

import { SolidityParser } from "@/modules";
import { DetectorViolation, ParsedContracts, SeverityValue } from "@/types";

export const ERC20_INDEXED_DETECTOR = "template-detector";

export class Erc20IndexedDetector extends AbstractDetector {
  public id = ERC20_INDEXED_DETECTOR;
  public title = "Un-indexed ERC20 Events";
  public description =
    "Detects whether events defined by the ERC20 specification that should have some parameters as indexed are missing the indexed keyword.";
  public severity = SeverityValue.Informational;

  detect(
    code: ParsedContracts
    // config: AnalyserConfig = {}
  ): Promise<DetectorViolation[]> {
    const { violations, addViolation } = this._violations();

    const contracts = SolidityParser.getContracts(code);
    contracts.forEach((contract) => {
      if (!SolidityParser.isErc20(contract)) return;

      SolidityParser.visit(contract, {
        EventDefinition: (node) => {
          if (node.name === "Transfer") {
            if (!node.parameters[0].isIndexed) {
              addViolation({
                message: "ERC20 Transfer event should have indexed `from` parameter",
                node,
                contract: contract.name,
              });
            }

            if (!node.parameters[1].isIndexed) {
              addViolation({
                message: "ERC20 Transfer event should have indexed `to` parameter",
                node,
                contract: contract.name,
              });
            }
          }

          if (node.name === "Approval") {
            if (!node.parameters[0].isIndexed) {
              addViolation({
                message: "ERC20 Approval event should have indexed `owner` parameter",
                node,
                contract: contract.name,
              });
            }

            if (!node.parameters[1].isIndexed) {
              addViolation({
                message: "ERC20 Approval event should have indexed `spender` parameter",
                node,
                contract: contract.name,
              });
            }
          }
        },
      });
    });

    return Promise.resolve(violations);
  }
}
