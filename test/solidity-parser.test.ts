import { describe, expect, test } from "bun:test";
import { TestContract } from "./contracts";
import { SolidityParserService } from "../services";
import {
  ContractDefinition,
  SourceUnit,
} from "@solidity-parser/parser/dist/src/ast-types";

const TEST_CONTRACT_FILE = "test/contracts/TestContract.sol";

describe("SolidityParserService", () => {
  describe("parse", () => {
    test("should parse Solidity code and return the corresponding AST", () => {
      const ast = SolidityParserService.parse(TestContract);

      expect(ast).toBeDefined();
      expect(ast.type).toBe("SourceUnit");
      expect(ast.children.length).toBe(2);

      const child = ast.children[1] as ContractDefinition;
      expect(child.type).toBe("ContractDefinition");
      expect(child.name).toBe("MyContract");
    });
  });

  describe("parseFile", () => {
    test("should parse a Solidity file and return the corresponding AST", () => {
      const path = "./MyContract.sol";

      const ast = SolidityParserService.parseFile(TEST_CONTRACT_FILE);

      expect(ast).toBeDefined();
      expect(ast.type).toBe("SourceUnit");
      expect(ast.children.length).toBe(2);

      const child = ast.children[1] as ContractDefinition;
      expect(child.type).toBe("ContractDefinition");
      expect(child.name).toBe("MyContract");
    });
  });
});
