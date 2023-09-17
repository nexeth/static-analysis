import * as parser from "@solidity-parser/parser";
import * as fs from "fs";
import { ParsedContract } from "../types";
import {
  ContractDefinition,
  StateVariableDeclaration,
} from "@solidity-parser/parser/dist/src/ast-types";

/**
 * A service for parsing Solidity code and files into an AST.
 */
export class SolidityParserService {
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
  public static getContracts(ast: ParsedContract): ContractDefinition[] {
    return ast.children.filter(
      (node) => node.type === "ContractDefinition"
    ) as ContractDefinition[];
  }

  /**
   * Returns an array of all state variables in the given Solidity AST.
   * @param ast The Solidity AST to search for state variables.
   * @returns An array of all state variables in the given Solidity AST.
   */
  public static getStateVariables(
    contracts: ContractDefinition[]
  ): StateVariableDeclaration[] {
    return contracts
      .map((contract) => contract.subNodes)
      .flat()
      .filter(
        (node) => node.type === "StateVariableDeclaration"
      ) as StateVariableDeclaration[];
  }
}
