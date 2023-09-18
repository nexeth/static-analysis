import * as fs from "fs";

import * as parser from "@solidity-parser/parser";
import {
  ContractDefinition,
  EnumDefinition,
  EventDefinition,
  FunctionDefinition,
  ModifierDefinition,
  StateVariableDeclaration,
  StructDefinition,
} from "@solidity-parser/parser/dist/src/ast-types";

import { ParsedContracts } from "@/types";

/**
 * A service for parsing Solidity code and files into an AST.
 */
export class SolidityParser {
  /**
   * Parses Solidity code and returns the corresponding AST.
   * @param code The Solidity code to parse.
   * @returns The parsed AST of the Solidity code.
   */
  public static parse(code: string) {
    return parser.parse(code);
  }

  /**
   * Parses a Solidity file located at the specified path.
   * @param path The path to the Solidity file.
   * @returns The parsed AST of the Solidity file.
   */
  public static parseFile(path: string) {
    const code = fs.readFileSync(path, "utf8");
    return this.parse(code);
  }

  /**
   * Returns an array of all contract definitions in the given Solidity AST.
   * @param ast The Solidity AST to search for contract definitions.
   * @returns An array of all contract definitions in the given Solidity AST.
   */
  public static getContracts(ast: ParsedContracts): ContractDefinition[] {
    return ast.children.filter(
      (node) => node.type === "ContractDefinition"
    ) as ContractDefinition[];
  }

  /**
   * Returns an array of all state variables in the given Solidity AST.
   * @param ast The Solidity AST to search for state variables.
   * @returns An array of all state variables in the given Solidity AST.
   */
  public static getStateVariables(contracts: ContractDefinition[]): StateVariableDeclaration[] {
    return contracts
      .map((contract) => contract.subNodes)
      .flat()
      .filter((node) => node.type === "StateVariableDeclaration") as StateVariableDeclaration[];
  }

  /**
   * Returns an array of all function definitions in the given Solidity AST.
   * @param contracts The Solidity AST to search for function definitions.
   * @returns An array of all function definitions in the given Solidity AST.
   */
  public static getFunctions(contracts: ContractDefinition[]): FunctionDefinition[] {
    return contracts
      .map((contract) => contract.subNodes)
      .flat()
      .filter((node) => node.type === "FunctionDefinition") as FunctionDefinition[];
  }

  /**
   * Returns an array of all event definitions in the given Solidity AST.
   * @param contracts The Solidity AST to search for event definitions.
   * @returns An array of all event definitions in the given Solidity AST.
   */
  public static getEvents(contracts: ContractDefinition[]): EventDefinition[] {
    return contracts
      .map((contract) => contract.subNodes)
      .flat()
      .filter((node) => node.type === "EventDefinition") as EventDefinition[];
  }

  /**
   * Returns an array of all struct definitions in the given Solidity AST.
   * @param contracts The Solidity AST to search for struct definitions.
   * @returns An array of all struct definitions in the given Solidity AST.
   */
  public static getStructs(contracts: ContractDefinition[]): StructDefinition[] {
    return contracts
      .map((contract) => contract.subNodes)
      .flat()
      .filter((node) => node.type === "StructDefinition") as StructDefinition[];
  }

  /**
   * Returns an array of all enum definitions in the given Solidity AST.
   * @param contracts The Solidity AST to search for enum definitions.
   * @returns An array of all enum definitions in the given Solidity AST.
   */
  public static getEnums(contracts: ContractDefinition[]): EnumDefinition[] {
    return contracts
      .map((contract) => contract.subNodes)
      .flat()
      .filter((node) => node.type === "EnumDefinition") as EnumDefinition[];
  }

  /**
   * Returns an array of all modifier definitions in the given Solidity AST.
   * @param contracts The Solidity AST to search for modifier definitions.
   * @returns An array of all modifier definitions in the given Solidity AST.
   */
  public static getModifiers(contracts: ContractDefinition[]): ModifierDefinition[] {
    return contracts
      .map((contract) => contract.subNodes)
      .flat()
      .filter((node) => node.type === "ModifierDefinition") as ModifierDefinition[];
  }

  /**
   *
   * @param contract The contract to search for inherited contracts.
   * @param contracts The Solidity AST to search for inherited contracts.
   */
  public static getInheritedContracts(
    contract: ContractDefinition,
    contracts: ContractDefinition[]
  ): ContractDefinition[] {
    const inheritedContractNames = contract.baseContracts.map(
      (baseContract) => baseContract.baseName.namePath
    );
    return contracts.filter((node) => {
      if (node.type !== "ContractDefinition") return false;
      return inheritedContractNames.includes(node.name);
    });
  }
}
