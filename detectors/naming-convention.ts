import {
  Detector,
  Severity,
  ParsedContract,
  AnalysisConfig,
  DetectorViolation,
} from "../types";
import { SolidityParserService } from "../services";
import { AbstractDetector } from "./abstract-detector";

export const NAMING_CONVENTION_DETECTOR = "naming-convention";

export class NamingConventionDetector implements AbstractDetector {
  public id = NAMING_CONVENTION_DETECTOR;
  public title = "Solidity Naming Convention Checker";
  public description = "Checks if Solidity naming conventions are followed";
  public severity = Severity.Informational;

  async detect(
    parsedContract: ParsedContract,
    config: AnalysisConfig
  ): Promise<DetectorViolation[]> {
    const violations: DetectorViolation[] = [];

    const addViolation = (target: string, name: string, convention: string) => {
      violations.push({ target, name, convention });
    };

    const contracts = SolidityParserService.getContracts(parsedContract);

    /**
     * Check contract name casing
     */
    contracts.map((contract) => {
      const contractName = contract.name;
      if (!this.isCapWords(contractName)) {
        addViolation("contract", contractName, "CapWords");
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
