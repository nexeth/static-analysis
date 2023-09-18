import { AbstractDetector } from "./abstract-detector";

import { SolidityParserService } from "@/services";
import {
  Severity,
  ParsedContract,
  AnalysisConfig,
  DetectorViolation,
} from "@/types";

export const NAMING_CONVENTION_DETECTOR = "naming-convention";

export class NamingConventionDetector implements AbstractDetector {
  public id = NAMING_CONVENTION_DETECTOR;
  public title = "Solidity Naming Convention Checker";
  public description = "Checks if Solidity naming conventions are followed";
  public severity = Severity.Informational;

  async detect(
    parsedContract: ParsedContract,
    config: AnalysisConfig = {}
  ): Promise<DetectorViolation[]> {
    const violations: DetectorViolation[] = [];

    const addViolation = (target: string, name: string, convention: string) => {
      violations.push({ target, name, convention });
    };

    const contracts = SolidityParserService.getContracts(parsedContract);
    contracts.forEach((contract) => {
      const contractName = contract.name;
      if (!this.isCapWords(contractName)) {
        addViolation("contract", contractName, "CapWords");
      }
    });

    const events = SolidityParserService.getEvents(contracts);
    events.forEach((event) => {
      if (!this.isCapWords(event.name)) {
        addViolation("event", event.name, "CapWords");
      }
    });

    const structs = SolidityParserService.getStructs(contracts);
    structs.forEach((struct) => {
      if (!this.isCapWords(struct.name)) {
        addViolation("struct", struct.name, "CapWords");
      }
    });

    const functions = SolidityParserService.getFunctions(contracts);
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

        addViolation("function", function_.name, "mixedCase");
      }

      function_.parameters.forEach((parameter) => {
        if (!parameter.name) return;
        if (this.isMixedCaseWithUnderscore(parameter.name)) return;
        addViolation("parameter", parameter.name, "mixedCase");
      });
    });

    const variables = SolidityParserService.getStateVariables(contracts);
    variables.forEach((variableDeclaration) => {
      variableDeclaration.variables.forEach((variable) => {
        if (!variable.name) return;
        if (this.isAvoidNames(variable.name)) {
          addViolation("variable", variable.name, "avoidNames");
        }
        if (variable.isDeclaredConst) {
          // ERC20 Compatible variable names
          if (["symbol", "name", "decimals"].includes(variable.name)) return;
          // Public constants are allowed any naming scheme
          if (variable.visibility === "public") return;

          if (!this.isUpperCaseWithUnderscores(variable.name)) {
            addViolation("variable", variable.name, "UPPER_CASE");
          }
        } else {
          if (
            variable.visibility === "private" &&
            this.isMixedCaseWithUnderscore(variable.name)
          ) {
            return;
          } else if (this.isMixedCase(variable.name)) return;
          addViolation("variable", variable.name, "mixedCase");
        }
      });
    });

    const enums = SolidityParserService.getEnums(contracts);
    enums.forEach((enum_) => {
      if (!this.isCapWords(enum_.name)) {
        addViolation("enum", enum_.name, "CapWords");
      }
    });

    const modifiers = SolidityParserService.getModifiers(contracts);
    modifiers.forEach((modifier) => {
      if (!this.isMixedCase(modifier.name)) {
        addViolation("modifier", modifier.name, "mixedCase");
      }
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
