import { describe, expect, test } from "bun:test";
import { SolidityParserService } from "../../services";
import {
  NAMING_CONVENTION_DETECTOR,
  NamingConventionDetector,
} from "../../detectors/naming-convention";
import { Severity } from "../../types";

const TEST_CONTRACT_FILE = "test/contracts/ViolationContract.sol";

describe("NamingConventionDetector", () => {
  const source = SolidityParserService.parseFile(TEST_CONTRACT_FILE);

  const detector = new NamingConventionDetector();

  describe("id", () => {
    test("should return the correct detector ID", () => {
      expect(detector.id).toBe(NAMING_CONVENTION_DETECTOR);
    });
  });

  describe("title", () => {
    test("should return the correct detector title", () => {
      expect(detector.title).toBe("Solidity Naming Convention Checker");
    });
  });

  describe("description", () => {
    test("should return the correct detector description", () => {
      expect(detector.description).toBe(
        "Checks if Solidity naming conventions are followed"
      );
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(Severity.Informational);
    });
  });

  describe("detect", () => {
    test("should return an empty array if no violations are found", async () => {
      const contract = `
      contract MyContract {}
      `;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(0);
    });

    test("should return a violation for an invalid contract name", async () => {
      const contract = `
      contract myContract {}
      `;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("contract");
      expect(violation.name).toBe("myContract");
      expect(violation.convention).toBe("CapWords");
    });

    test("should return a violation for an invalid event name", async () => {
      const contract = `
      contract MyContract {
        event myEvent();
      }
      `;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("event");
      expect(violation.name).toBe("myEvent");
      expect(violation.convention).toBe("CapWords");
    });

    test("should return a violation for an invalid struct name", async () => {
      const contract = `
      contract MyContract {
        struct myStruct {}
      }
      `;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("struct");
      expect(violation.name).toBe("myStruct");
      expect(violation.convention).toBe("CapWords");
    });

    test("should return a violation for an invalid enum name", async () => {
      const contract = `
      contract MyContract {
        enum myEnum {}
      }
      `;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("enum");
      expect(violation.name).toBe("myEnum");
      expect(violation.convention).toBe("CapWords");
    });

    test("should return a violation for an invalid modifier name", async () => {
      const contract = `
      contract MyContract {
        modifier MyModifier() {}
      }
      `;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("modifier");
      expect(violation.name).toBe("MyModifier");
      expect(violation.convention).toBe("mixedCase");
    });

    test("should return a violation for an invalid variable name (casing)", async () => {
      const contract = `
      contract MyContract {
        uint MyVariable;
      }
      `;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("variable");
      expect(violation.name).toBe("MyVariable");
      expect(violation.convention).toBe("mixedCase");
    });

    test("should return a violation for an invalid variable name (avoidNames)", async () => {
      const contract = `
      contract MyContract {
        uint l;
      }
      `;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("variable");
      expect(violation.name).toBe("l");
      expect(violation.convention).toBe("avoidNames");
    });

    test("should return a violation for a public variable name with invalid casing", async () => {
      const contract = `
      contract MyContract {
        uint public MyVariable;
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("variable");
      expect(violation.name).toBe("MyVariable");
      expect(violation.convention).toBe("mixedCase");
    });

    test("should return no violation for an ERC20 standard constant", async () => {
      const contract = `
      contract MyContract {
        string public name;
        string public symbol;
        uint8 public decimals;
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(0);
    });

    test("should return no violation for a public constant", async () => {
      const contract = `
      contract MyContract {
        uint public constant MY_CONSTANT;
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(0);
    });

    test("should return a violation for a private constant with invalid casing", async () => {
      const contract = `
      contract MyContract {
        uint private constant myConstant;
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("variable");
      expect(violation.name).toBe("myConstant");
      expect(violation.convention).toBe("UPPER_CASE");
    });

    test("should return a violation for a private variable with invalid casing", async () => {
      const contract = `
      contract MyContract {
        uint private MY_Variable;
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("variable");
      expect(violation.name).toBe("MY_Variable");
      expect(violation.convention).toBe("mixedCase");
    });

    test("should return no violation for a private variable with valid casing", async () => {
      const contract = `
      contract MyContract {
        uint private myVariable;
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(0);
    });

    test("should return no violation for a constructor", async () => {
      const contract = `
      contract MyContract {
        constructor() {}
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(0);
    });

    test("should return no violation for an internal function with valid casing", async () => {
      const contract = `
      contract MyContract {
        function myFunction() internal {}
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });

    test("should return a violation for an internal function with invalid casing", async () => {
      const contract = `
      contract MyContract {
        function MyFunction() internal {}
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("function");
      expect(violation.name).toBe("MyFunction");
      expect(violation.convention).toBe("mixedCase");
    });

    test("should not return a violation for an internal function with invalid casing if it starts with underscore", async () => {
      const contract = `
      contract MyContract {
        function _myFunction() internal {}
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });

    test("should not return a violation for an internal function with invalid casing if it starts with echidna_", async () => {
      const contract = `
      contract MyContract {
        function echidna_myFunction() internal {}
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });

    test("should not return a violation for an internal function with invalid casing if it starts with crytic_", async () => {
      const contract = `
      contract MyContract {
        function crytic_myFunction() internal {}
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });

    test("should ignore parameters without a name", async () => {
      const contract = `
      contract MyContract {
        function myFunction(uint, uint) internal {}
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });

    test("should return a violation for a parameter with invalid casing", async () => {
      const contract = `
      contract MyContract {
        function myFunction(uint MyParameter) internal {}
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.target).toBe("parameter");
      expect(violation.name).toBe("MyParameter");
      expect(violation.convention).toBe("mixedCase");
    });

    test("should allow for a parameter if it starts with an underscore", async () => {
      const contract = `
      contract MyContract {
        function myFunction(uint _myParameter) internal {}
      }`;
      const parsedContract = SolidityParserService.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });
  });
});
