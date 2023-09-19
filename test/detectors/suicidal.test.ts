import { describe, expect, test } from "bun:test";

import { SolidityParser } from "@/modules";
import { SUICIDAL, SuicidalDetector } from "@/modules/analyser/detectors/suicidal";
import { SeverityValue } from "@/types";

describe("SuicidalDetector", () => {
  const detector = new SuicidalDetector();

  describe("id", () => {
    test("should return the correct detector ID", () => {
      expect(detector.id).toBe(SUICIDAL);
    });
  });

  describe("title", () => {
    test("should return the correct detector title", () => {
      expect(detector.title).toBe("Suicidal");
    });
  });

  describe("description", () => {
    test("should return the correct detector description", () => {
      expect(detector.description).toBe("Unprotected call to a function executing `selfdestruct`/`suicide`.");
    });
  });

  describe("severity", () => {
    test("should return the correct detector severity", () => {
      expect(detector.severity).toBe(SeverityValue.High);
    });
  });

  describe("detect", () => {
    test("should return no violations for a contract with no violating functions", async () => {
      const code = `
        contract Test {
          function foo(uint256 a, uint256 b) public pure returns (uint256) {
            return a + b;
          }
        }
      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });

    test("should return a violation for a contract with an unprotected selfdestruct", async () => {
      const code = `
      contract Suicidal{
    function kill() public{
        selfdestruct(msg.sender);
    }
}

      `;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(1);
      expect(violations[0].message).toBe("function contains an unprotected selfdestruct");
    });

    test("should not return a violation for a contract with a protected selfdestruct", async () => {
      const code = `
      contract Suicidal{
    function kill() onlyOwner public{
        selfdestruct(msg.sender);
    }
  }`;

      const parsedContract = SolidityParser.parse(code);
      const violations = await detector.detect(parsedContract);
      expect(violations).toHaveLength(0);
    });
  });
});
