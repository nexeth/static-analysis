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
      if (!this.isCapWords(contractName)) {
        addViolation("contract", contractName, "expected CapWords", contract, contractName);
      }

      const events = SolidityParser.getEvents([contract]);
      events.forEach((event) => {
        if (!this.isCapWords(event.name)) {
          addViolation("event", event.name, "expected CapWords", event, contract.name);
        }
      });

      const structs = SolidityParser.getStructs([contract]);
      structs.forEach((struct) => {
        if (!this.isCapWords(struct.name)) {
          addViolation("struct", struct.name, "expected CapWords", struct, contract.name);
        }
      });

      const functions = SolidityParser.getFunctions([contract]);
      functions.forEach((function_) => {
        if (function_.isConstructor) return;
        if (!function_.name) return;
        if (!this.isMixedCase(function_.name)) {
          if (
            ["internal", "private"].includes(function_.visibility) &&
            this.isMixedCaseWithUnderscore(function_.name)
          ) {
            return;
          }
          if (function_.name.startsWith("echidna_")) return;
          if (function_.name.startsWith("crytic_")) return;

          addViolation("function", function_.name, "expected mixedCase", function_, contract.name);
        }

        function_.parameters.forEach((parameter) => {
          if (!parameter.name) return;
          if (this.isMixedCaseWithUnderscore(parameter.name)) return;
          addViolation("parameter", parameter.name, "expected mixedCase", parameter, contract.name);
        });
      });

      const variables = SolidityParser.getStateVariables([contract]);
      variables.forEach((variableDeclaration) => {
        variableDeclaration.variables.forEach((variable) => {
          if (!variable.name) return;
          if (this.isAvoidNames(variable.name)) {
            addViolation("variable", variable.name, "detected invalidName", variable, contract.name);
          }
          if (variable.isDeclaredConst) {
            // ERC20 Compatible variable names
            if (["symbol", "name", "decimals"].includes(variable.name)) return;
            // Public constants are allowed any naming scheme
            if (variable.visibility === "public") return;

            if (!this.isUpperCaseWithUnderscores(variable.name)) {
              addViolation("variable", variable.name, "expected UPPER_CASE", variable, contract.name);
            }
          } else {
            if (variable.visibility === "private" && this.isMixedCaseWithUnderscore(variable.name)) {
              return;
            } else if (this.isMixedCase(variable.name)) return;
            addViolation("variable", variable.name, "expected mixedCase", variable, contract.name);
          }
        });
      });

      const enums = SolidityParser.getEnums([contract]);
      enums.forEach((enum_) => {
        if (!this.isCapWords(enum_.name)) {
          addViolation("enum", enum_.name, "expected CapWords", enum_, contract.name);
        }
      });

      const modifiers = SolidityParser.getModifiers([contract]);
      modifiers.forEach((modifier) => {
        if (!this.isMixedCase(modifier.name)) {
          addViolation("modifier", modifier.name, "expected mixedCase", modifier, contract.name);
        }
      });
    });

    return violations;
  }

  private isCapWords(name: string) {
    return /^[A-Z]([A-Za-z0-9]+)?_?$/.test(name);
  }

  private isMixedCase(name: string) {
    return /^[a-z]([A-Za-z0-9]+)?_?$/.test(name);
  }

  private isMixedCaseWithUnderscore(name: string) {
    return /^[_]?[a-z]([A-Za-z0-9]+)?_?$/.test(name);
  }

  private isUpperCaseWithUnderscores(name: string) {
    return /^[A-Z0-9_]+_?$/.test(name);
  }

  private isAvoidNames(name: string) {
    return /^[lOI]$/.test(name);
  }
}
