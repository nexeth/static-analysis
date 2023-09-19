import { AbstractDetector } from "./abstract-detector";

import { SolidityParser } from "@/modules";
import { SeverityValue, ParsedContracts, DetectorViolation } from "@/types";

export const NAMING_CONVENTION_DETECTOR = "naming-convention";

export class NamingConventionDetector extends AbstractDetector {
  public id = NAMING_CONVENTION_DETECTOR;
  public title = "Solidity Naming Convention Checker";
  public description = "Checks if Solidity naming conventions are followed";
  public severity = SeverityValue.Informational;

  async detect(
    parsedContract: ParsedContracts
    // config: AnalyserConfig = {}
  ): Promise<DetectorViolation[]> {
    const { violations, addViolation } = this._violations();

    const contracts = SolidityParser.getContracts(parsedContract);
    contracts.forEach((contract) => {
      const contractName = contract.name;
      if (!this.isPascalCase(contractName)) {
        addViolation({
          message: `contract ${contractName} is not in PascalCase`,
          node: contract,
          contract: contractName,
        });
      }

      const events = SolidityParser.getEvents([contract]);
      events.forEach((event) => {
        if (!this.isPascalCase(event.name)) {
          addViolation({
            message: `event ${event.name} is not in PascalCase`,
            node: event,
            contract: contract.name,
          });
        }
      });

      const structs = SolidityParser.getStructs([contract]);
      structs.forEach((struct) => {
        if (!this.isPascalCase(struct.name)) {
          addViolation({
            message: `struct ${struct.name} is not in PascalCase`,
            node: struct,
            contract: contract.name,
          });
        }
      });

      const functions = SolidityParser.getFunctions([contract]);
      functions.forEach((function_) => {
        if (function_.isConstructor) return;
        if (!function_.name) return;
        if (!this.isCamelCase(function_.name)) {
          if (
            ["internal", "private"].includes(function_.visibility) &&
            this.isCamelCaseWithUnderscore(function_.name)
          ) {
            return;
          }
          if (function_.name.startsWith("echidna_")) return;
          if (function_.name.startsWith("crytic_")) return;

          addViolation({
            message: `function ${function_.name} is not in camelCase`,
            node: function_,
            contract: contract.name,
          });
        }

        function_.parameters.forEach((parameter) => {
          if (!parameter.name) return;
          if (this.isCamelCaseWithUnderscore(parameter.name)) return;
          addViolation({
            message: `parameter ${parameter.name} is not in camelCase`,
            node: parameter,
            contract: contract.name,
          });
        });
      });

      const variables = SolidityParser.getStateVariables([contract]);
      variables.forEach((variableDeclaration) => {
        variableDeclaration.variables.forEach((variable) => {
          if (!variable.name) return;
          if (this.isAvoidNames(variable.name)) {
            addViolation({
              message: `variable ${variable.name} is using invalid name`,
              node: variable,
              contract: contract.name,
            });
          }
          if (variable.isDeclaredConst) {
            // ERC20 Compatible variable names
            if (["symbol", "name", "decimals"].includes(variable.name)) return;
            // Public constants are allowed any naming scheme
            if (variable.visibility === "public") return;

            if (!this.isUpperCaseWithUnderscores(variable.name)) {
              addViolation({
                message: `constant ${variable.name} is not in UPPER_CASE`,
                node: variable,
                contract: contract.name,
              });
            }
          } else {
            if (variable.visibility === "private" && this.isCamelCaseWithUnderscore(variable.name)) {
              return;
            } else if (this.isCamelCase(variable.name)) return;
            addViolation({
              message: `variable ${variable.name} is not in camelCase`,
              node: variable,
              contract: contract.name,
            });
          }
        });
      });

      const enums = SolidityParser.getEnums([contract]);
      enums.forEach((enum_) => {
        if (!this.isPascalCase(enum_.name)) {
          addViolation({
            message: `enum ${enum_.name} is not in PascalCase`,
            node: enum_,
            contract: contract.name,
          });
        }
      });

      const modifiers = SolidityParser.getModifiers([contract]);
      modifiers.forEach((modifier) => {
        if (!this.isCamelCase(modifier.name)) {
          addViolation({
            message: `modifier ${modifier.name} is not in camelCase`,
            node: modifier,
            contract: contract.name,
          });
        }
      });
    });

    return violations;
  }

  private isPascalCase(name: string) {
    return /^[A-Z]([A-Za-z0-9]+)?_?$/.test(name);
  }

  private isCamelCase(name: string) {
    return /^[a-z]([A-Za-z0-9]+)?_?$/.test(name);
  }

  private isCamelCaseWithUnderscore(name: string) {
    return /^[_]?[a-z]([A-Za-z0-9]+)?_?$/.test(name);
  }

  private isUpperCaseWithUnderscores(name: string) {
    return /^[A-Z0-9_]+_?$/.test(name);
  }

  private isAvoidNames(name: string) {
    return /^[lOI]$/.test(name);
  }
}
