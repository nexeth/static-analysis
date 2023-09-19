import { describe, expect, test } from "bun:test";

import { SolidityParser } from "@/modules";
import { NAMING_CONVENTION_DETECTOR, NamingConventionDetector } from "@/modules/analyser/detectors/naming-convention";
import { SeverityValue } from "@/types";

describe("NamingConventionDetector", () => {
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
      expect(detector.description).toBe("Checks if Solidity naming conventions are followed");
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(SeverityValue.Informational);
    });
  });

  describe("detect", () => {
    test("should return an empty array if no violations are found", async () => {
      const contract = `
      contract MyContract {}
      `;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(0);
    });

    test("should return a violation for an invalid contract name", async () => {
      const contract = `
      contract myContract {}
      `;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
    });

    test("should return a violation for an invalid event name", async () => {
      const contract = `
      contract MyContract {
        event myEvent();
      }
      `;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.message).toBe("event myEvent is not in PascalCase");
    });

    test("should return a violation for an invalid struct name", async () => {
      const contract = `
      contract MyContract {
        struct myStruct {}
      }
      `;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.message).toBe("struct myStruct is not in PascalCase");
    });

    test("should return a violation for an invalid enum name", async () => {
      const contract = `
      contract MyContract {
        enum myEnum {}
      }
      `;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.message).toBe("enum myEnum is not in PascalCase");
    });

    test("should return a violation for an invalid modifier name", async () => {
      const contract = `
      contract MyContract {
        modifier MyModifier() {}
      }
      `;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.message).toBe("modifier MyModifier is not in camelCase");
    });

    test("should return a violation for an invalid variable name (casing)", async () => {
      const contract = `
      contract MyContract {
        uint MyVariable;
      }
      `;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.message).toBe("variable MyVariable is not in camelCase");
    });

    test("should return a violation for an invalid variable name (avoidNames)", async () => {
      const contract = `
      contract MyContract {
        uint l;
      }
      `;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.message).toBe("variable l is using invalid name");
    });

    test("should return a violation for a public variable name with invalid casing", async () => {
      const contract = `
      contract MyContract {
        uint public MyVariable;
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.message).toBe("variable MyVariable is not in camelCase");
    });

    test("should return no violation for an ERC20 standard constant", async () => {
      const contract = `
      contract MyContract {
        string public name;
        string public symbol;
        uint8 public decimals;
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(0);
    });

    test("should return no violation for a public constant", async () => {
      const contract = `
      contract MyContract {
        uint public constant MY_CONSTANT;
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(0);
    });

    test("should return a violation for a private constant with invalid casing", async () => {
      const contract = `
      contract MyContract {
        uint private constant myConstant;
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.message).toBe("constant myConstant is not in UPPER_CASE");
    });

    test("should return a violation for a private variable with invalid casing", async () => {
      const contract = `
      contract MyContract {
        uint private MY_Variable;
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.message).toBe("variable MY_Variable is not in camelCase");
    });

    test("should return no violation for a private variable with valid casing", async () => {
      const contract = `
      contract MyContract {
        uint private myVariable;
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(0);
    });

    test("should return no violation for a constructor", async () => {
      const contract = `
      contract MyContract {
        constructor() {}
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations).toBeDefined();
      expect(violations.length).toBe(0);
    });

    test("should return no violation for an internal function with valid casing", async () => {
      const contract = `
      contract MyContract {
        function myFunction() internal {}
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });

    test("should return a violation for an internal function with invalid casing", async () => {
      const contract = `
      contract MyContract {
        function MyFunction() internal {}
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.message).toBe("function MyFunction is not in camelCase");
    });

    test("should not return a violation for an internal function with invalid casing if it starts with underscore", async () => {
      const contract = `
      contract MyContract {
        function _myFunction() internal {}
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });

    test("should not return a violation for an internal function with invalid casing if it starts with echidna_", async () => {
      const contract = `
      contract MyContract {
        function echidna_myFunction() internal {}
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });

    test("should not return a violation for an internal function with invalid casing if it starts with crytic_", async () => {
      const contract = `
      contract MyContract {
        function crytic_myFunction() internal {}
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });

    test("should ignore parameters without a name", async () => {
      const contract = `
      contract MyContract {
        function myFunction(uint, uint) internal {}
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });

    test("should return a violation for a parameter with invalid casing", async () => {
      const contract = `
      contract MyContract {
        function myFunction(uint MyParameter) internal {}
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(1);
      const violation = violations[0];
      expect(violation.message).toBe("parameter MyParameter is not in camelCase");
    });

    test("should allow for a parameter if it starts with an underscore", async () => {
      const contract = `
      contract MyContract {
        function myFunction(uint _myParameter) internal {}
      }`;
      const parsedContract = SolidityParser.parse(contract);
      const violations = await detector.detect(parsedContract);
      expect(violations.length).toBe(0);
    });
  });
});
