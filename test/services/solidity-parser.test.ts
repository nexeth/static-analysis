import { ContractDefinition } from "@solidity-parser/parser/dist/src/ast-types";
import { describe, expect, test } from "bun:test";

import { SolidityParserService } from "../../services";

import { TestContract } from "./../contracts";

const TEST_CONTRACT_FILE = "test/contracts/SolidityParserContract.sol";

describe("SolidityParserService", () => {
  describe("parse", () => {
    test("should parse Solidity code and return the corresponding AST", () => {
      const ast = SolidityParserService.parse(TestContract);

      expect(ast).toBeDefined();
      expect(ast.type).toBe("SourceUnit");
      expect(ast.children.length).toBe(2);

      const child = ast.children[1] as ContractDefinition;
      expect(child.type).toBe("ContractDefinition");
      expect(child.name).toBe("SolidityParserContract");
    });
  });

  describe("parseFile", () => {
    test("should parse a Solidity file and return the corresponding AST", () => {
      const ast = SolidityParserService.parseFile(TEST_CONTRACT_FILE);

      expect(ast).toBeDefined();
      expect(ast.type).toBe("SourceUnit");
      expect(ast.children.length).toBe(2);

      const child = ast.children[1] as ContractDefinition;
      expect(child.type).toBe("ContractDefinition");
      expect(child.name).toBe("SolidityParserContract");
    });
  });

  describe("getContracts", () => {
    test("should return an array of all contract definitions in the given Solidity AST", () => {
      const ast = SolidityParserService.parseFile(TEST_CONTRACT_FILE);

      const contracts = SolidityParserService.getContracts(ast);

      expect(contracts).toBeDefined();
      expect(contracts.length).toBeGreaterThan(0);

      const _contract = contracts[0];
      expect(_contract.type).toBe("ContractDefinition");
      expect(_contract.name).toBe("SolidityParserContract");
    });
  });

  describe("getStateVariables", () => {
    test("should return an array of all state variables in the given Solidity AST", () => {
      const ast = SolidityParserService.parseFile(TEST_CONTRACT_FILE);
      const contracts = SolidityParserService.getContracts(ast);
      const stateVariables = SolidityParserService.getStateVariables(contracts);
      expect(stateVariables).toBeDefined();
      expect(stateVariables.length).toBeGreaterThan(0);

      const _stateVariable = stateVariables[0];
      expect(_stateVariable.type).toBe("StateVariableDeclaration");
      expect(_stateVariable.variables[0].type).toBe("VariableDeclaration");
      expect(_stateVariable.variables[0].name).toBe("myNumber");
    });
  });

  describe("getFunctions", () => {
    test("should return an array of all functions in the given Solidity AST", () => {
      const ast = SolidityParserService.parseFile(TEST_CONTRACT_FILE);
      const contracts = SolidityParserService.getContracts(ast);
      const functions = SolidityParserService.getFunctions(contracts);

      expect(functions).toBeDefined();
      expect(functions.length).toBeGreaterThan(0);

      const _constructor = functions[0];
      expect(_constructor.type).toBe("FunctionDefinition");
      expect(_constructor.name).toBeNull();

      const _function = functions[1];
      expect(_function.type).toBe("FunctionDefinition");
      expect(_function.name).toBe("myFunction");
    });
  });

  describe("getEvents", () => {
    test("should return an array of all events in the given Solidity AST", () => {
      const ast = SolidityParserService.parseFile(TEST_CONTRACT_FILE);
      const contracts = SolidityParserService.getContracts(ast);
      const events = SolidityParserService.getEvents(contracts);
      expect(events).toBeDefined();
      expect(events.length).toBeGreaterThan(0);

      const _event = events[0];
      expect(_event.type).toBe("EventDefinition");
      expect(_event.name).toBe("MyEvent");
    });
  });

  describe("getStructs", () => {
    test("should return an array of all structs in the given Solidity AST", () => {
      const ast = SolidityParserService.parseFile(TEST_CONTRACT_FILE);
      const contracts = SolidityParserService.getContracts(ast);
      const structs = SolidityParserService.getStructs(contracts);
      expect(structs).toBeDefined();
      expect(structs.length).toBe(1);

      const _struct = structs[0];
      expect(_struct.type).toBe("StructDefinition");
      expect(_struct.name).toBe("MyStruct");
    });
  });

  describe("getEnums", () => {
    test("should return an array of all enums in the given Solidity AST", () => {
      const ast = SolidityParserService.parseFile(TEST_CONTRACT_FILE);
      const contracts = SolidityParserService.getContracts(ast);
      const enums = SolidityParserService.getEnums(contracts);
      expect(enums).toBeDefined();
      expect(enums.length).toBeGreaterThan(0);

      const _enum = enums[0];
      expect(_enum.type).toBe("EnumDefinition");
      expect(_enum.name).toBe("MyEnum");
    });
  });

  describe("getModifiers", () => {
    test("should return an array of all modifiers in the given Solidity AST", () => {
      const ast = SolidityParserService.parseFile(TEST_CONTRACT_FILE);
      const contracts = SolidityParserService.getContracts(ast);
      const modifiers = SolidityParserService.getModifiers(contracts);
      expect(modifiers).toBeDefined();
      expect(modifiers.length).toBeGreaterThan(0);

      const _modifier = modifiers[0];
      expect(_modifier.type).toBe("ModifierDefinition");
      expect(_modifier.name).toBe("myModifier");
    });
  });
});
